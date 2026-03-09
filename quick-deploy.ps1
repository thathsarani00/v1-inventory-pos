#!/usr/bin/env pwsh
# FULL DEPLOYMENT - Upload everything and restart
# Use this ONLY when you make changes to the code

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  FULL DEPLOYMENT (WITH FILE UPLOAD)" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan

$SERVER = "root@45.8.149.194"
$REMOTE = "/root/v1-inventory-pos"

Set-Location E:\react

Write-Host "[1/4] Uploading configuration files..." -ForegroundColor Yellow
scp docker-compose.yml frontend-nginx.conf "${SERVER}:${REMOTE}/"

Write-Host "`n[2/4] Creating directory structure..." -ForegroundColor Yellow
ssh $SERVER "mkdir -p ${REMOTE}/react/template"

Write-Host "`n[3/4] Uploading frontend build (1-2 minutes)..." -ForegroundColor Yellow
scp -r react/template/dist "${SERVER}:${REMOTE}/react/template/"

Write-Host "`n[4/4] Restarting all services..." -ForegroundColor Yellow
ssh $SERVER "cd ${REMOTE} && docker-compose down && docker-compose up -d"

Write-Host "`nWaiting 10 seconds for services to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

Write-Host "`nChecking service status..." -ForegroundColor Cyan
ssh $SERVER "cd ${REMOTE} && docker-compose ps"

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  DEPLOYMENT COMPLETE!" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nTest URLs:" -ForegroundColor Yellow
Write-Host "  Frontend: http://45.8.149.194:3000" -ForegroundColor White
Write-Host "  Backend:  http://45.8.149.194:5555/v1/auth/register`n" -ForegroundColor White
