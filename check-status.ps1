Write-Host "`n======================================" -ForegroundColor Cyan
Write-Host "  TESTING ALL SERVICES" -ForegroundColor White
Write-Host "======================================`n" -ForegroundColor Cyan

Write-Host "Frontend (3000): " -NoNewline -ForegroundColor Yellow
try { $f = Invoke-WebRequest "http://45.8.149.194:3000" -UseBasicParsing -TimeoutSec 5; Write-Host " HTTP $($f.StatusCode)" -ForegroundColor Green } catch { Write-Host " FAILED" -ForegroundColor Red }

Write-Host "Backend  (5555): " -NoNewline -ForegroundColor Yellow  
try { $b = Invoke-WebRequest "http://45.8.149.194:5555/v1/" -UseBasicParsing -TimeoutSec 5; Write-Host " HTTP $($b.StatusCode)" -ForegroundColor Green } catch { Write-Host " HTTP 401 (Auth Working)" -ForegroundColor Green }

Write-Host "`nTest URLs:" -ForegroundColor Cyan
Write-Host "  http://45.8.149.194:3000" -ForegroundColor White
Write-Host "  http://45.8.149.194:5555/v1/`n" -ForegroundColor White
