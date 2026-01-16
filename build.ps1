#Requires -Version 5.1
$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[build] Building frontend (SvelteKit/Vite) -> frontend/build ..." -ForegroundColor Cyan
Push-Location "$RootDir\frontend"
try {
    npm run build
    if ($LASTEXITCODE -ne 0) { exit 1 }
}
finally {
    Pop-Location
}

Write-Host "[build] Building Tauri bundles ..." -ForegroundColor Cyan
Push-Location "$RootDir\backend"

# Check for Tauri CLI
$tauriCmd = Get-Command tauri -ErrorAction SilentlyContinue
$tauriMajor = $null
if ($tauriCmd) {
    try {
        $v = & tauri --version 2>$null
        if ($v -match "(\d+)\.") { $tauriMajor = [int]$Matches[1] }
    } catch { }
}

$cargoTauriMajor = $null
try {
    $cv = & cargo tauri --version 2>$null
    if ($cv -match "(\d+)\.") { $cargoTauriMajor = [int]$Matches[1] }
} catch { }

try {
    # Prefer a v2-compatible CLI since this repo uses Tauri 2.x config/deps.
    if ($cargoTauriMajor -ge 2) {
        cargo tauri build @args
    }
    elseif ($tauriCmd -and $tauriMajor -ge 2) {
        tauri build @args
    }
    else {
        if ($tauriCmd -and $tauriMajor -and $tauriMajor -lt 2) {
            Write-Host "[build] ERROR: Found Tauri CLI v$tauriMajor, but this project requires Tauri CLI v2." -ForegroundColor Red
        }
        else {
            Write-Host "[build] ERROR: No Tauri CLI v2 found." -ForegroundColor Red
        }
        Write-Host "[build] Install/upgrade one of:" -ForegroundColor Red
        Write-Host "  - npm:   npm install -g `"@tauri-apps/cli@^2`"" -ForegroundColor Yellow
        Write-Host "  - cargo: cargo install tauri-cli --version `"^2`"" -ForegroundColor Yellow
        exit 1
    }
}
finally {
    Pop-Location
}
