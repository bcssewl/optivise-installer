use serde::Serialize;
use std::path::PathBuf;
use tauri::Manager;
use tauri_plugin_opener::OpenerExt;

const MANIFEST_URL: &str = "https://ex.optivise.app/manifest.xml";
const MANIFEST_FILENAME: &str = "optivise.xml";

#[derive(Debug, Clone, Copy, PartialEq, serde::Deserialize)]
#[serde(rename_all = "lowercase")]
enum OfficeApp {
    Excel,
    Word,
    PowerPoint,
}

impl OfficeApp {
    fn container_id(&self) -> &'static str {
        match self {
            OfficeApp::Excel => "com.microsoft.Excel",
            OfficeApp::Word => "com.microsoft.Word",
            OfficeApp::PowerPoint => "com.microsoft.Powerpoint",
        }
    }

    fn app_path(&self) -> &'static str {
        match self {
            OfficeApp::Excel => "/Applications/Microsoft Excel.app",
            OfficeApp::Word => "/Applications/Microsoft Word.app",
            OfficeApp::PowerPoint => "/Applications/Microsoft PowerPoint.app",
        }
    }

    fn display_name(&self) -> &'static str {
        match self {
            OfficeApp::Excel => "Excel",
            OfficeApp::Word => "Word",
            OfficeApp::PowerPoint => "PowerPoint",
        }
    }

    fn wef_dir(&self) -> Option<PathBuf> {
        dirs::home_dir().map(|home| {
            home.join("Library/Containers")
                .join(self.container_id())
                .join("Data/Documents/wef")
        })
    }

    fn manifest_path(&self) -> Option<PathBuf> {
        self.wef_dir().map(|dir| dir.join(MANIFEST_FILENAME))
    }
}

#[derive(Serialize)]
struct AppStatus {
    app: String,
    office_installed: bool,
    manifest_installed: bool,
    supported: bool,
}

#[derive(Serialize)]
struct AllStatus {
    apps: Vec<AppStatus>,
}

fn is_office_installed(app: OfficeApp) -> bool {
    std::path::Path::new(app.app_path()).exists()
}

fn is_manifest_installed(app: OfficeApp) -> bool {
    app.manifest_path()
        .map(|p| p.exists())
        .unwrap_or(false)
}

#[tauri::command]
fn get_all_status() -> AllStatus {
    let apps = [OfficeApp::Excel, OfficeApp::Word, OfficeApp::PowerPoint];
    AllStatus {
        apps: apps
            .iter()
            .map(|&app| AppStatus {
                app: app.display_name().to_string(),
                office_installed: is_office_installed(app),
                manifest_installed: is_manifest_installed(app),
                supported: matches!(app, OfficeApp::Excel),
            })
            .collect(),
    }
}

#[tauri::command]
fn check_office_installed(app: OfficeApp) -> bool {
    is_office_installed(app)
}

#[tauri::command]
fn check_manifest_installed(app: OfficeApp) -> bool {
    is_manifest_installed(app)
}

#[tauri::command]
async fn install_manifest(app: OfficeApp) -> Result<String, String> {
    // Download manifest
    let response = reqwest::get(MANIFEST_URL)
        .await
        .map_err(|e| format!("Failed to download manifest: {}", e))?;

    if !response.status().is_success() {
        return Err(format!(
            "Server returned status {}",
            response.status()
        ));
    }

    let manifest_content = response
        .text()
        .await
        .map_err(|e| format!("Failed to read manifest: {}", e))?;

    // Validate it's actually an Office manifest
    if !manifest_content.contains("<OfficeApp") {
        return Err("Downloaded file is not a valid Office manifest".to_string());
    }

    // Get wef directory
    let wef_dir = app
        .wef_dir()
        .ok_or("Could not determine home directory")?;

    // Create wef directory if it doesn't exist
    std::fs::create_dir_all(&wef_dir).map_err(|e| {
        if e.kind() == std::io::ErrorKind::PermissionDenied {
            format!(
                "Permission denied creating {}. On macOS 14+, try: right-click the app → Open, or grant Full Disk Access in System Settings → Privacy & Security.",
                wef_dir.display()
            )
        } else {
            format!("Failed to create directory {}: {}", wef_dir.display(), e)
        }
    })?;

    // Write manifest
    let manifest_path = wef_dir.join(MANIFEST_FILENAME);
    std::fs::write(&manifest_path, &manifest_content).map_err(|e| {
        if e.kind() == std::io::ErrorKind::PermissionDenied {
            format!(
                "Permission denied writing to {}. On macOS 14+, try: right-click the app → Open, or grant Full Disk Access in System Settings → Privacy & Security.",
                manifest_path.display()
            )
        } else {
            format!("Failed to write manifest: {}", e)
        }
    })?;

    Ok(format!(
        "Optivise add-in installed for {}. Restart {} to activate.",
        app.display_name(),
        app.display_name()
    ))
}

#[tauri::command]
fn uninstall_manifest(app: OfficeApp) -> Result<String, String> {
    let manifest_path = app
        .manifest_path()
        .ok_or("Could not determine home directory")?;

    if !manifest_path.exists() {
        return Ok("Add-in is not installed".to_string());
    }

    std::fs::remove_file(&manifest_path)
        .map_err(|e| format!("Failed to remove manifest: {}", e))?;

    Ok(format!(
        "Optivise add-in removed from {}. Restart {} to complete.",
        app.display_name(),
        app.display_name()
    ))
}

#[tauri::command]
fn open_office_app(app: OfficeApp, app_handle: tauri::AppHandle) -> Result<(), String> {
    let path = app.app_path();
    if !std::path::Path::new(path).exists() {
        return Err(format!("{} is not installed", app.display_name()));
    }

    app_handle
        .opener()
        .open_path(path, None::<&str>)
        .map_err(|e| format!("Failed to open {}: {}", app.display_name(), e))
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_all_status,
            check_office_installed,
            check_manifest_installed,
            install_manifest,
            uninstall_manifest,
            open_office_app,
        ])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            #[cfg(target_os = "macos")]
            {
                use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};
                let _ = apply_vibrancy(&window, NSVisualEffectMaterial::Sidebar, None, None);
            }

            let _ = window;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
