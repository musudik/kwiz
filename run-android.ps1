# =============================================================================
# KWIZ App - Android Development Runner
# =============================================================================
param(
    [switch]$Clean,
    [switch]$Release,
    [switch]$Device,
    [switch]$Web,
    [switch]$Tunnel
)

Write-Host ""
Write-Host "========================================"
Write-Host "    KWIZ App - Development Runner"
Write-Host "========================================"
Write-Host ""

# Environment Setup - Use Android Studio's bundled JDK (Java 21)
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:PATH"

# Check Java
Write-Host "[1/3] Checking Java..."
$javaVersion = & java -version 2>&1 | Select-Object -First 1
if ($javaVersion -match "21") {
    Write-Host "  [OK] Java 21 configured" -ForegroundColor Green
} elseif ($javaVersion -match "17") {
    Write-Host "  [OK] Java 17 configured (compatible)" -ForegroundColor Green
} else {
    Write-Host "  [WARN] Unexpected Java version: $javaVersion" -ForegroundColor Yellow
    Write-Host "  [INFO] Using JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Cyan
}

# Check Android SDK
Write-Host "[2/3] Checking Android SDK..."
if (Test-Path "$env:ANDROID_HOME\platform-tools\adb.exe") {
    Write-Host "  [OK] Android SDK found at: $env:ANDROID_HOME" -ForegroundColor Green
} else {
    Write-Host "  [ERROR] Android SDK not found!" -ForegroundColor Red
    Write-Host "  [INFO] Expected at: $env:ANDROID_HOME" -ForegroundColor Cyan
    exit 1
}

# Check devices
Write-Host "[3/3] Checking connected devices..."
$devices = & adb devices 2>&1 | Select-String -Pattern "device$"
if ($devices) {
    Write-Host "  [OK] Device(s) connected:" -ForegroundColor Green
    & adb devices | Select-Object -Skip 1 | Where-Object { $_ -match "device" } | ForEach-Object {
        Write-Host "       - $_" -ForegroundColor Cyan
    }
} else {
    Write-Host "  [INFO] No physical devices connected" -ForegroundColor Yellow
    Write-Host "  [INFO] Will use Expo Go app on your phone" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "----------------------------------------"
Write-Host ""

# Handle different run modes
if ($Web) {
    Write-Host "Starting Expo for Web..." -ForegroundColor Cyan
    Write-Host ""
    npx expo start --web --clear
}
elseif ($Tunnel) {
    Write-Host "Starting Expo with Tunnel (for remote devices)..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "[TIP] Use tunnel mode if your phone and PC are on different networks" -ForegroundColor Yellow
    Write-Host ""
    npx expo start --tunnel --clear
}
elseif ($Device) {
    Write-Host "Starting Expo for connected device..." -ForegroundColor Cyan
    Write-Host ""
    npx expo start --android --clear
}
elseif ($Release) {
    Write-Host "Building Android Release..." -ForegroundColor Cyan
    Write-Host ""
    npx expo run:android --variant release
}
elseif ($Clean) {
    Write-Host "Cleaning and restarting..." -ForegroundColor Cyan
    Write-Host ""
    # Clear Metro bundler cache
    Remove-Item -Path "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue
    npx expo start --clear
}
else {
    # Default: Start Expo Go compatible server
    Write-Host "Starting Expo Go Development Server..." -ForegroundColor Green
    Write-Host ""
    Write-Host "[TIP] Scan the QR code with Expo Go app on your Android phone" -ForegroundColor Yellow
    Write-Host "[TIP] Make sure your phone and PC are on the same WiFi network" -ForegroundColor Yellow
    Write-Host "[TIP] Use -Tunnel flag if you have network issues" -ForegroundColor Yellow
    Write-Host ""
    npx expo start --clear
}
