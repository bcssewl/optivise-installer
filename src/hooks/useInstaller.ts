import { useState, useCallback, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export type AppName = "Excel" | "Word" | "PowerPoint";

interface AppStatus {
  app: string;
  office_installed: boolean;
  manifest_installed: boolean;
  supported: boolean;
}

interface AllStatus {
  apps: AppStatus[];
}

interface AppState {
  officeInstalled: boolean;
  manifestInstalled: boolean;
  supported: boolean;
  loading: boolean;
  message: string | null;
  error: string | null;
}

const defaultState: AppState = {
  officeInstalled: false,
  manifestInstalled: false,
  supported: false,
  loading: false,
  message: null,
  error: null,
};

export function useInstaller() {
  const [apps, setApps] = useState<Record<AppName, AppState>>({
    Excel: { ...defaultState },
    Word: { ...defaultState },
    PowerPoint: { ...defaultState },
  });
  const [initialLoading, setInitialLoading] = useState(true);

  const refreshStatus = useCallback(async () => {
    try {
      const status = await invoke<AllStatus>("get_all_status");
      setApps((prev) => {
        const next = { ...prev };
        for (const s of status.apps) {
          const name = s.app as AppName;
          next[name] = {
            ...next[name],
            officeInstalled: s.office_installed,
            manifestInstalled: s.manifest_installed,
            supported: s.supported,
          };
        }
        return next;
      });
    } catch {
      // Status check failed silently — UI shows defaults
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const clearMessages = (app: AppName) => {
    setApps((prev) => ({
      ...prev,
      [app]: { ...prev[app], message: null, error: null },
    }));
  };

  const setLoading = (app: AppName, loading: boolean) => {
    setApps((prev) => ({
      ...prev,
      [app]: { ...prev[app], loading },
    }));
  };

  const installManifest = useCallback(
    async (app: AppName) => {
      clearMessages(app);
      setLoading(app, true);
      try {
        const msg = await invoke<string>("install_manifest", {
          app: app.toLowerCase(),
        });
        setApps((prev) => ({
          ...prev,
          [app]: { ...prev[app], message: msg, error: null, loading: false },
        }));
        await refreshStatus();
      } catch (e) {
        setApps((prev) => ({
          ...prev,
          [app]: {
            ...prev[app],
            error: String(e),
            message: null,
            loading: false,
          },
        }));
      }
    },
    [refreshStatus],
  );

  const uninstallManifest = useCallback(
    async (app: AppName) => {
      clearMessages(app);
      setLoading(app, true);
      try {
        const msg = await invoke<string>("uninstall_manifest", {
          app: app.toLowerCase(),
        });
        setApps((prev) => ({
          ...prev,
          [app]: { ...prev[app], message: msg, error: null, loading: false },
        }));
        await refreshStatus();
      } catch (e) {
        setApps((prev) => ({
          ...prev,
          [app]: {
            ...prev[app],
            error: String(e),
            message: null,
            loading: false,
          },
        }));
      }
    },
    [refreshStatus],
  );

  const openApp = useCallback(async (app: AppName) => {
    clearMessages(app);
    try {
      await invoke("open_office_app", { app: app.toLowerCase() });
    } catch (e) {
      setApps((prev) => ({
        ...prev,
        [app]: { ...prev[app], error: String(e), message: null },
      }));
    }
  }, []);

  const uninstallAll = useCallback(async () => {
    const installed = (Object.keys(apps) as AppName[]).filter(
      (name) => apps[name].manifestInstalled,
    );
    for (const app of installed) {
      await uninstallManifest(app);
    }
  }, [apps, uninstallManifest]);

  return { apps, initialLoading, installManifest, uninstallManifest, uninstallAll, openApp, refreshStatus };
}
