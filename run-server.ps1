# =============================================================================
# KWIZ Backend Server Runner
# =============================================================================

Write-Host ""
Write-Host "========================================"
Write-Host "    KWIZ Backend Server"
Write-Host "========================================"
Write-Host ""

# Navigate to server directory
Push-Location "$PSScriptRoot\server"

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing dependencies..."
    npm install
    Write-Host ""
}

# Start the server
Write-Host "[INFO] Starting server..."
Write-Host ""
npm start

Pop-Location
