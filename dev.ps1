#Requires -Version 5.1
$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$VitePort = if ($env:VITE_PORT) { $env:VITE_PORT } else { "5173" }
$FrontendJob = $null
$RootLocationPushed = $false

function Cleanup {
    if ($FrontendJob -and $FrontendJob.State -eq 'Running') {
        Write-Host "[dev] Stopping frontend server..." -ForegroundColor Yellow
        Stop-Job -Job $FrontendJob -ErrorAction SilentlyContinue
        Remove-Job -Job $FrontendJob -Force -ErrorAction SilentlyContinue
    }
    # Also kill any node processes on the port
    $portListeners = Get-NetTCPConnection -LocalPort $VitePort -State Listen -ErrorAction SilentlyContinue
    foreach ($listener in $portListeners) {
        $proc = Get-Process -Id $listener.OwningProcess -ErrorAction SilentlyContinue
        if ($proc -and $proc.ProcessName -match "node") {
            Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
        }
    }
}

# Register cleanup on script exit
$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action { Cleanup }
trap { Cleanup; break }

function Get-PortListeners {
    param([int]$Port)
    Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
}

function Test-IsOurDevServer {
    param([int]$ProcessId)
    $proc = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
    if (-not $proc) { return $false }
    # Check if it's a Node process (likely our Vite dev server)
    return $proc.ProcessName -match "node"
}

function Stop-OurPortListeners {
    param([int]$Port)
    $listeners = Get-PortListeners -Port $Port
    if (-not $listeners) { return }

    $anyKilled = $false
    foreach ($listener in $listeners) {
        if (Test-IsOurDevServer -ProcessId $listener.OwningProcess) {
            Write-Host "[dev] Port $Port is in use by an old dev server (pid $($listener.OwningProcess)). Stopping it..." -ForegroundColor Yellow
            Stop-Process -Id $listener.OwningProcess -Force -ErrorAction SilentlyContinue
            $anyKilled = $true
        }
    }

    if ($anyKilled) {
        Start-Sleep -Milliseconds 300
    }
}

# Check for node_modules
if (-not (Test-Path "$RootDir\frontend\node_modules")) {
    Write-Host "[dev] Frontend deps not found. Installing (npm ci) ..." -ForegroundColor Yellow
    Set-Location "$RootDir\frontend"
    npm ci
    if ($LASTEXITCODE -ne 0) { exit 1 }
}

# Kill old dev servers on our port
Stop-OurPortListeners -Port $VitePort

# Check if port is still in use
$remainingListeners = Get-PortListeners -Port $VitePort
if ($remainingListeners) {
    Write-Host "[dev] Port $VitePort is already in use by a non-app process." -ForegroundColor Red
    Write-Host "[dev] Please stop it or run with a different port:" -ForegroundColor Red
    Write-Host "[dev]   `$env:VITE_PORT=XXXX; .\dev.ps1" -ForegroundColor Red
    exit 1
}

Write-Host "[dev] Starting frontend (SvelteKit) on http://localhost:$VitePort ..." -ForegroundColor Cyan
$FrontendJob = Start-Job -ScriptBlock {
    param($dir, $port)
    Set-Location $dir
    npm run dev -- --host 127.0.0.1 --port $port
} -ArgumentList "$RootDir\frontend", $VitePort

# Give the frontend a moment to start
Start-Sleep -Seconds 2

Write-Host "[dev] Starting Tauri ..." -ForegroundColor Cyan
Push-Location "$RootDir\backend"
$RootLocationPushed = $true

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
        cargo tauri dev
    }
    elseif ($tauriCmd -and $tauriMajor -ge 2) {
        tauri dev
    }
    else {
        if ($tauriCmd -and $tauriMajor -and $tauriMajor -lt 2) {
            Write-Host "[dev] ERROR: Found Tauri CLI v$tauriMajor, but this project requires Tauri CLI v2." -ForegroundColor Red
        }
        else {
            Write-Host "[dev] ERROR: No Tauri CLI v2 found." -ForegroundColor Red
        }
        Write-Host "[dev] Install/upgrade one of:" -ForegroundColor Red
        Write-Host "  - npm:   npm install -g `"@tauri-apps/cli@^2`"" -ForegroundColor Yellow
        Write-Host "  - cargo: cargo install tauri-cli --version `"^2`"" -ForegroundColor Yellow
        exit 1
    }
}
finally {
    Cleanup
    if ($RootLocationPushed) { Pop-Location }
}
