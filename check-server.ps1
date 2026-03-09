# Check server status
Write-Host "Checking server containers..." -ForegroundColor Cyan

$password = Read-Host "Enter server password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Check containers
Write-Host "`nChecking Docker containers..." -ForegroundColor Yellow
$containerStatus = echo $plainPassword | ssh root@45.8.149.194 "docker ps --filter 'name=inventory' --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"
Write-Host $containerStatus

# Test backend API  
Write-Host "`nTesting Backend API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://45.8.149.194:5555/v1/health" -Method GET -TimeoutSec 5
    Write-Host "✓ Backend is UP! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend not responding: $($_.Exception.Message)" -ForegroundColor Red
}

# Test frontend
Write-Host "`nTesting Frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://45.8.149.194:5555/" -Method GET -TimeoutSec 5
    Write-Host "✓ Frontend is serving! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "✗ Frontend not responding: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nServer URLs:" -ForegroundColor Cyan
Write-Host "Backend API: http://45.8.149.194:5555/v1/" -ForegroundColor White
Write-Host "Frontend:    http://45.8.149.194:5555/" -ForegroundColor White
Write-Host "Health:      http://45.8.149.194:5555/v1/health" -ForegroundColor White
