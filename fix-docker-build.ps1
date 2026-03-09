# Docker Build Fix Script
# This script rebuilds Docker containers without cache to fix Node version issues

Write-Host "=== Docker Build Fix Script ===" -ForegroundColor Cyan
Write-Host ""

# Stop running containers
Write-Host "Step 1: Stopping running containers..." -ForegroundColor Yellow
docker-compose down

# Remove old images (optional, uncomment if needed)
# Write-Host "Step 2: Removing old images..." -ForegroundColor Yellow
# docker-compose rm -f

# Build without cache
Write-Host "Step 2: Building without cache (this may take a while)..." -ForegroundColor Yellow
docker-compose build --no-cache

# Start containers
Write-Host "Step 3: Starting containers..." -ForegroundColor Yellow
docker-compose up -d

# Show container status
Write-Host ""
Write-Host "Step 4: Container Status:" -ForegroundColor Green
docker-compose ps

Write-Host ""
Write-Host "=== Build Complete ===" -ForegroundColor Cyan
Write-Host "Check logs with: docker-compose logs -f app" -ForegroundColor White
