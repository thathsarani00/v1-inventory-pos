# QUICK RESTART - Just restart services (NO file upload)
# Use this when services are down but files are already uploaded

$SERVER = "root@45.8.149.194"
$REMOTE = "/root/v1-inventory-pos"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  QUICK RESTART (NO UPLOAD)" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Restarting all services..." -ForegroundColor Yellow
ssh $SERVER "cd ${REMOTE} && docker-compose restart"

Write-Host "`nWaiting 8 seconds for services to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 8

Write-Host "`nChecking service status..." -ForegroundColor Cyan
ssh $SERVER "cd ${REMOTE} && docker-compose ps"

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  RESTART COMPLETE!" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nAccess URLs:" -ForegroundColor Yellow
Write-Host "  Frontend: http://45.8.149.194:3000" -ForegroundColor White
Write-Host "  Backend:  http://45.8.149.194:5555/v1/" -ForegroundColor White
Write-Host "`n"
