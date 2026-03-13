#!/usr/bin/env pwsh
# ============================================================
# Deploy to 207.180.193.135 via SSH
# Usage: .\deploy.ps1
# ============================================================

$SERVER   = "207.180.193.135"
$USER     = "root"
$APP_DIR  = "/opt/inventory-app"
$SSH_OPTS = "-o StrictHostKeyChecking=accept-new"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Inventory App - Docker Deploy"          -ForegroundColor Cyan
Write-Host "  Target: $USER@$SERVER"                  -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ── Step 1: Create project archive (tar of working tree) ──────────────────────
Write-Host "[1/4] Creating project archive..." -ForegroundColor Yellow

$TAR_FILE = "$env:TEMP\inventory-app.tar.gz"
Set-Location "e:\react"

# Use tar to get ACTUAL working tree files (not just committed)
tar -czf $TAR_FILE `
    --exclude="backend/target" `
    --exclude="react/template/node_modules" `
    --exclude="react/template/dist" `
    --exclude=".git" `
    . 2>$null

$sizeMB = [math]::Round((Get-Item $TAR_FILE).Length / 1MB, 1)
Write-Host "     Archive: $TAR_FILE ($sizeMB MB)" -ForegroundColor Green

# ── Step 2: Create the remote setup+build script ──────────────────────────────
$REMOTE_SCRIPT = "$env:TEMP\deploy-remote.sh"
@'
#!/bin/bash
set -e
APP_DIR="/opt/inventory-app"

echo "==> Extracting archive..."
cd $APP_DIR
tar -xzf app.tar.gz
rm -f app.tar.gz

echo "==> Checking Docker..."
if ! command -v docker &>/dev/null; then
  echo "Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl start docker
  systemctl enable docker
fi

if ! docker compose version &>/dev/null 2>&1; then
  echo "Installing Docker Compose plugin..."
  apt-get install -y docker-compose-plugin 2>/dev/null || true
fi

echo "==> Docker version:"
docker --version
docker compose version

echo "==> Stopping existing containers..."
docker compose down --remove-orphans 2>/dev/null || true

echo "==> Building Docker image (this takes a few minutes)..."
echo ""
docker compose build --no-cache --progress=plain

echo ""
echo "==> Starting containers..."
docker compose up -d

echo ""
echo "==> Running containers:"
docker compose ps

echo ""
echo "============================================"
echo "  Deploy complete!"
echo "  App: http://207.180.193.135:5555/"
echo "  API: http://207.180.193.135:5555/v1/"
echo "============================================"
'@ | Set-Content -Path $REMOTE_SCRIPT -Encoding UTF8 -NoNewline

# Fix line endings to LF
(Get-Content $REMOTE_SCRIPT -Raw) -replace "`r`n", "`n" | Set-Content $REMOTE_SCRIPT -NoNewline

Write-Host "     Remote script created." -ForegroundColor Green

# ── Step 3: Upload archive + script in one scp call ───────────────────────────
Write-Host ""
Write-Host "[2/4] Uploading to $SERVER..." -ForegroundColor Yellow
Write-Host "      Enter password when prompted" -ForegroundColor DarkGray

# Upload both files at once with one password prompt
& ssh $SSH_OPTS "${USER}@${SERVER}" "mkdir -p $APP_DIR"
& scp $SSH_OPTS "$TAR_FILE" "$REMOTE_SCRIPT" "${USER}@${SERVER}:${APP_DIR}/"
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Upload failed." -ForegroundColor Red; exit 1
}
Write-Host "     Upload complete." -ForegroundColor Green

# ── Step 4: Run the remote script (one SSH connection, live logs) ──────────────
Write-Host ""
Write-Host "[3/4] Building on server (live log)..." -ForegroundColor Yellow
Write-Host "----------------------------------------------" -ForegroundColor DarkGray

& ssh $SSH_OPTS "${USER}@${SERVER}" "chmod +x ${APP_DIR}/deploy-remote.sh && bash ${APP_DIR}/deploy-remote.sh"
$buildCode = $LASTEXITCODE

Write-Host "----------------------------------------------" -ForegroundColor DarkGray
Write-Host ""

if ($buildCode -eq 0) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  SUCCESS!" -ForegroundColor Green
    Write-Host "  App: http://${SERVER}:5555/" -ForegroundColor Green
    Write-Host "  API: http://${SERVER}:5555/v1/" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host "Build failed (exit $buildCode). Debug:" -ForegroundColor Red
    Write-Host "  ssh $USER@$SERVER" -ForegroundColor Yellow
    Write-Host "  cd $APP_DIR && docker compose logs" -ForegroundColor Yellow
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
