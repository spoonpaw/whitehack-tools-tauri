#Requires -Version 5.1
$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[setup] Installing frontend dependencies (npm ci) ..." -ForegroundColor Cyan
Push-Location "$RootDir\frontend"

function Invoke-NpmCapture {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Args
    )

    $output = & npm @Args 2>&1
    return [PSCustomObject]@{
        ExitCode = $LASTEXITCODE
        Output   = $output
    }
}

try {
    if (Test-Path "package-lock.json") {
        # npm ci requires package-lock.json to match package.json exactly.
        # When deps change, fall back to npm install to refresh the lockfile.
        $ci = Invoke-NpmCapture -Args @("ci")
        if ($ci.ExitCode -ne 0) {
            $isLockfileMismatch =
                ($ci.Output -match "npm ci` can only install packages when your package\.json and package-lock\.json") -or
                ($ci.Output -match "package\.json and package-lock\.json.*are in sync")

            if ($isLockfileMismatch) {
                Write-Host "[setup] package-lock.json is out of sync; running npm install to refresh it ..." -ForegroundColor Yellow
                npm install
                if ($LASTEXITCODE -ne 0) { exit 1 }
            }
            else {
                Write-Host "[setup] npm ci failed. Output:" -ForegroundColor Red
                $ci.Output | ForEach-Object { Write-Host $_ }
                exit $ci.ExitCode
            }
        }
    }
    else {
        npm install
        if ($LASTEXITCODE -ne 0) { exit 1 }
    }
}
catch {
    Write-Host "[setup] Setup failed." -ForegroundColor Red
    throw
}
finally {
    Pop-Location
}

Write-Host ""
Write-Host "[setup] Done." -ForegroundColor Green
Write-Host "[setup] Next:"
Write-Host "  - Dev:   .\dev.ps1"
Write-Host "  - Build: .\build.ps1"
