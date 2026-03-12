#!/usr/bin/env pwsh
# ============================================================
# Deploy to 207.180.193.135 via SSH
# Usage: .\deploy.ps1
# ============================================================

$SERVER   = "207.180.193.135"
$USER     = "root"
$APP_DIR  = "/opt/inventory-app"
$SSH_OPTS = @("-o", "StrictHostKeyChecking=accept-new")

function Invoke-SSH([string]$Cmd) {
    & ssh @SSH_OPTS "${USER}@${SERVER}" $Cmd
    return $LASTEXITCODE
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Inventory App - Docker Deploy" -ForegroundColor Cyan
Write-Host "  Target: $USER@$SERVER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ── Step 1: Create a tar of the project (exclude node_modules, target, .git) ──
Write-Host "[1/4] Creating project archive..." -ForegroundColor Yellow

$TAR_FILE = "$env:TEMP\inventory-app.tar.gz"

# Use git to create archive of tracked files (clean + fast)
Set-Location "e:\react"
git archive --format=tar.gz --output="$TAR_FILE" HEAD 2>&1
if ($LASTEXITCODE -ne 0) {
    # Fallback: manual tar if not a git repo
    Write-Host "     (git archive failed, using tar fallback)" -ForegroundColor DarkGray
    $exclude = @("--exclude=backend/target", "--exclude=react/template/node_modules",
                 "--exclude=react/template/dist", "--exclude=.git")
    tar -czf $TAR_FILE $exclude . 2>&1 | Out-Null
}

$sizeMB = [math]::Round((Get-Item $TAR_FILE).Length / 1MB, 1)
Write-Host "     Archive created: $TAR_FILE ($sizeMB MB)" -ForegroundColor Green

# ── Step 2: Upload archive to server ──────────────────────────────────────────
Write-Host ""
Write-Host "[2/4] Uploading to $SERVER..." -ForegroundColor Yellow

Invoke-SSH "mkdir -p $APP_DIR" | Out-Null
& scp @SSH_OPTS "$TAR_FILE" "${USER}@${SERVER}:${APP_DIR}/app.tar.gz"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Upload failed." -ForegroundColor Red; exit 1
}
Write-Host "     Upload complete." -ForegroundColor Green

# ── Step 3: Extract and prepare on server ─────────────────────────────────────
Write-Host ""
Write-Host "[3/4] Extracting and preparing server..." -ForegroundColor Yellow

$rc = Invoke-SSH "cd $APP_DIR && tar -xzf app.tar.gz && rm -f app.tar.gz && echo 'Extracted OK'"
if ($rc -ne 0) { Write-Host "ERROR: Extraction failed." -ForegroundColor Red; exit 1 }

Invoke-SSH "command -v docker &>/dev/null && echo 'Docker already installed' || (curl -fsSL https://get.docker.com | sh)"
Invoke-SSH "docker compose version &>/dev/null && echo 'Compose OK' || (apt-get install -y docker-compose-plugin 2>/dev/null; echo 'Compose installed')"

Write-Host "     Server ready." -ForegroundColor Green

# ── Step 4: Docker build + up (with live logs) ────────────────────────────────
Write-Host ""
Write-Host "[4/4] Building Docker image (live log)..." -ForegroundColor Yellow
Write-Host "----------------------------------------------" -ForegroundColor DarkGray

Invoke-SSH "cd $APP_DIR && docker compose down --remove-orphans 2>/dev/null; docker compose build --no-cache --progress=plain"
$buildCode = $LASTEXITCODE

if ($buildCode -eq 0) {
    Invoke-SSH "cd $APP_DIR && docker compose up -d && echo '' && docker compose ps"
}

Write-Host ""
Write-Host "----------------------------------------------" -ForegroundColor DarkGray
if ($buildCode -eq 0) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  SUCCESS!" -ForegroundColor Green
    Write-Host "  App: http://${SERVER}:5555/" -ForegroundColor Green
    Write-Host "  API: http://${SERVER}:5555/v1/" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host "Build failed. SSH in to check:" -ForegroundColor Red
    Write-Host "  ssh $USER@$SERVER" -ForegroundColor Yellow
    Write-Host "  cd $APP_DIR && docker compose logs -f" -ForegroundColor Yellow
}
