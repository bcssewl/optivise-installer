<#
.SYNOPSIS
    Installs or uninstalls the Optivise AI add-in for Microsoft Office on Windows.

.EXAMPLE
    # Install
    irm https://optivise.app/install.ps1 | iex

    # Uninstall
    .\install-windows.ps1 -Uninstall
#>
param(
    [switch]$Uninstall
)

$ErrorActionPreference = "Stop"

$ManifestUrl = "https://ex.optivise.app/manifest.xml"
$CatalogDir = Join-Path $env:LOCALAPPDATA "Optivise\AddInCatalog"
$ManifestPath = Join-Path $CatalogDir "optivise.xml"
$CatalogId = "optivise-addin-catalog"
$RegistryPath = "HKCU:\SOFTWARE\Microsoft\Office\16.0\WEF\TrustedCatalogs\$CatalogId"

# --- UI Helpers ---

function Write-Brand {
    Write-Host ""
    Write-Host "  " -NoNewline
    Write-Host " OPTIVISE " -ForegroundColor Black -BackgroundColor Green -NoNewline
    Write-Host ""
    Write-Host ""
}

function Write-Header($title) {
    $line = [string]::new([char]0x2500, 44)
    Write-Host "  $line" -ForegroundColor DarkGray
    Write-Host "  $title" -ForegroundColor White
    Write-Host "  $line" -ForegroundColor DarkGray
    Write-Host ""
}

function Write-Step($num, $total, $msg) {
    Write-Host "  [" -NoNewline -ForegroundColor DarkGray
    Write-Host "$num/$total" -NoNewline -ForegroundColor Cyan
    Write-Host "] " -NoNewline -ForegroundColor DarkGray
    Write-Host "$msg" -ForegroundColor Gray
}

function Write-Ok($msg) {
    Write-Host "       " -NoNewline
    Write-Host ([char]0x2714) -NoNewline -ForegroundColor Green
    Write-Host " $msg" -ForegroundColor DarkGray
}

function Write-Fail($msg) {
    Write-Host "       " -NoNewline
    Write-Host ([char]0x2718) -NoNewline -ForegroundColor Red
    Write-Host " $msg" -ForegroundColor Red
}

function Write-Spinner($msg, $scriptBlock) {
    $frames = @([char]0x25DC, [char]0x25DD, [char]0x25DE, [char]0x25DF)
    $job = Start-Job -ScriptBlock $scriptBlock
    $i = 0
    while ($job.State -eq "Running") {
        $frame = $frames[$i % $frames.Length]
        Write-Host "`r       $frame $msg" -NoNewline -ForegroundColor DarkGray
        Start-Sleep -Milliseconds 120
        $i++
    }
    $result = Receive-Job $job -ErrorAction SilentlyContinue
    Remove-Job $job -Force
    Write-Host "`r       " -NoNewline
    Write-Host ([char]0x2714) -NoNewline -ForegroundColor Green
    Write-Host " $msg" -ForegroundColor DarkGray
    return $result
}

function Write-SuccessBox($lines) {
    $maxLen = ($lines | Measure-Object -Maximum -Property Length).Maximum
    $border = [string]::new([char]0x2500, $maxLen + 4)

    Write-Host ""
    Write-Host "  " -NoNewline
    Write-Host ([char]0x250C) -NoNewline -ForegroundColor Green
    Write-Host $border -NoNewline -ForegroundColor Green
    Write-Host ([char]0x2510) -ForegroundColor Green

    foreach ($line in $lines) {
        $pad = [string]::new(' ', $maxLen - $line.Length)
        Write-Host "  " -NoNewline
        Write-Host ([char]0x2502) -NoNewline -ForegroundColor Green
        Write-Host "  $line$pad  " -NoNewline -ForegroundColor White
        Write-Host ([char]0x2502) -ForegroundColor Green
    }

    Write-Host "  " -NoNewline
    Write-Host ([char]0x2514) -NoNewline -ForegroundColor Green
    Write-Host $border -NoNewline -ForegroundColor Green
    Write-Host ([char]0x2518) -ForegroundColor Green
    Write-Host ""
}

# --- Uninstall ---

if ($Uninstall) {
    Write-Brand
    Write-Header "  Uninstall Optivise Add-in"

    $step = 1; $total = 2

    Write-Step $step $total "Removing manifest file"
    if (Test-Path $ManifestPath) {
        Remove-Item $ManifestPath -Force
        Write-Ok "Manifest removed"
    } else {
        Write-Ok "Already removed"
    }

    $step++
    Write-Step $step $total "Cleaning up registry"
    if (Test-Path $RegistryPath) {
        Remove-Item $RegistryPath -Force
        Write-Ok "Registry entry removed"
    } else {
        Write-Ok "Already clean"
    }

    # Clean up empty directory
    if ((Test-Path $CatalogDir) -and @(Get-ChildItem $CatalogDir).Count -eq 0) {
        Remove-Item $CatalogDir -Force -ErrorAction SilentlyContinue
    }

    Write-SuccessBox @(
        "Optivise add-in uninstalled",
        "",
        "Restart any open Office apps to complete."
    )
    exit 0
}

# --- Install ---

Write-Brand
Write-Header "  Install Optivise Add-in"

$step = 1; $total = 4

# 1. Create catalog directory
Write-Step $step $total "Creating catalog directory"
if (-not (Test-Path $CatalogDir)) {
    New-Item -ItemType Directory -Path $CatalogDir -Force | Out-Null
}
Write-Ok $CatalogDir

# 2. Download manifest
$step++
Write-Step $step $total "Downloading manifest"
try {
    $url = $ManifestUrl
    $content = Write-Spinner "Downloading from server..." {
        $resp = Invoke-WebRequest -Uri $using:url -UseBasicParsing
        return $resp.Content
    }

    # Fallback if job didn't return content (scope issue)
    if (-not $content) {
        $content = (Invoke-WebRequest -Uri $ManifestUrl -UseBasicParsing).Content
        Write-Ok "Downloaded"
    }
} catch {
    Write-Fail "Failed to download: $_"
    exit 1
}

# 3. Validate manifest
$step++
Write-Step $step $total "Validating manifest"
if ($content -notmatch "<OfficeApp") {
    Write-Fail "Invalid Office manifest"
    exit 1
}
Set-Content -Path $ManifestPath -Value $content -Encoding UTF8
Write-Ok "Valid manifest saved"

# 4. Register trusted catalog
$step++
Write-Step $step $total "Registering with Office"
if (-not (Test-Path $RegistryPath)) {
    New-Item -Path $RegistryPath -Force | Out-Null
}
Set-ItemProperty -Path $RegistryPath -Name "Id" -Value $CatalogId
Set-ItemProperty -Path $RegistryPath -Name "Url" -Value $CatalogDir
Set-ItemProperty -Path $RegistryPath -Name "Flags" -Value 1 -Type DWord
Write-Ok "Trusted catalog registered"

Write-SuccessBox @(
    "Optivise add-in installed!",
    "",
    "Next steps:",
    "  1. Open Excel (or restart if open)",
    "  2. Go to Home > Add-ins",
    "  3. Click SHARED FOLDER",
    "  4. Add Optivise AI"
)
