#!/usr/bin/env pwsh
# Deploy React frontend to 207.180.193.135 (serves on port 3000)

$SERVER = "207.180.193.135"
$USER   = "root"
$SSH    = "-o StrictHostKeyChecking=accept-new"

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Frontend Deploy -> $USER@$SERVER"    -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

$DIST = "e:\react\react\template\dist"
if (-not (Test-Path "$DIST\index.html")) {
    Write-Host "ERROR: dist not found. Run 'npm run build' first." -ForegroundColor Red
    exit 1
}

# ── Step 1: Pack dist ─────────────────────────────────────────────────────────
Write-Host ""
Write-Host "[1/3] Packing dist..." -ForegroundColor Yellow
$TAR = "$env:TEMP\frontend-dist.tar.gz"
tar -czf $TAR -C $DIST .
Write-Host "      Pack: $([math]::Round((Get-Item $TAR).Length/1KB))KB" -ForegroundColor Green

# ── Step 2: Upload + configure on server (single SSH session) ─────────────────
Write-Host ""
Write-Host "[2/3] Uploading (enter password when prompted)..." -ForegroundColor Yellow
scp $SSH "$TAR" "${USER}@${SERVER}:/tmp/frontend-dist.tar.gz"
if ($LASTEXITCODE -ne 0) { Write-Host "Upload failed." -ForegroundColor Red; exit 1 }
Write-Host "      Uploaded." -ForegroundColor Green

# ── Step 3: SSH - extract, create nginx conf and docker-compose, start ─────────
Write-Host ""
Write-Host "[3/3] Setting up nginx on server (enter password)..." -ForegroundColor Yellow

$REMOTE = @'
set -e
mkdir -p /opt/frontend/dist
cd /opt/frontend

echo "==> Extracting..."
tar -xzf /tmp/frontend-dist.tar.gz -C dist/
rm /tmp/frontend-dist.tar.gz

echo "==> Writing nginx config..."
cat > nginx.conf << 'EOF'
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
    # Forward API calls to backend (optional, already handled by frontend)
    location /v1/ {
        proxy_pass http://207.180.193.135:5555;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

echo "==> Writing docker-compose..."
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  frontend:
    image: nginx:alpine
    container_name: inventory-frontend
    ports:
      - "3000:80"
    volumes:
      - ./dist:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    restart: unless-stopped
EOF

echo "==> Starting frontend container..."
docker compose down --remove-orphans 2>/dev/null || true
docker compose up -d

echo ""
echo "==> Running containers:"
docker compose ps

echo ""
echo "============================================"
echo "  Frontend live at: http://207.180.193.135:3000"
echo "  Backend API:       http://207.180.193.135:5555/v1"
echo "============================================"
'@

# Fix line endings to LF for Linux
$tmpScript = "$env:TEMP\setup-frontend.sh"
$REMOTE -replace "`r`n", "`n" | Set-Content -Path $tmpScript -NoNewline -Encoding UTF8

scp $SSH "$tmpScript" "${USER}@${SERVER}:/tmp/setup-frontend.sh"
ssh $SSH "${USER}@${SERVER}" "bash /tmp/setup-frontend.sh && rm /tmp/setup-frontend.sh"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "  SUCCESS!" -ForegroundColor Green
    Write-Host "  Frontend: http://${SERVER}:3000" -ForegroundColor Green
    Write-Host "  Backend:  http://${SERVER}:5555/v1" -ForegroundColor Green
} else {
    Write-Host "Deploy failed. Check output above." -ForegroundColor Red
}
