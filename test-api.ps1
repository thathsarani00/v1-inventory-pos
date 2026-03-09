# Quick API Test - Register හා Login Test කරන්න

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  API ENDPOINT TEST" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://45.8.149.194:5555/v1"
$randomEmail = "test$(Get-Random -Minimum 1000 -Maximum 9999)@example.com"

# Test 1: Register
Write-Host "[1/3] Testing REGISTER endpoint..." -ForegroundColor Yellow
$registerBody = @{
    firstName = "Test"
    lastName = "User"
    email = $randomEmail
    password = "test12345"
    phone = "0771234567"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "  ✓ Registration successful!" -ForegroundColor Green
    Write-Host "    User ID: $($registerResponse.userId)" -ForegroundColor White
    Write-Host "    Email: $randomEmail" -ForegroundColor White
    $token = $registerResponse.token
} catch {
    Write-Host "  ✗ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Login
Write-Host "`n[2/3] Testing LOGIN endpoint..." -ForegroundColor Yellow
$loginBody = @{
    email = $randomEmail
    password = "test12345"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "  ✓ Login successful!" -ForegroundColor Green
    Write-Host "    Name: $($loginResponse.firstName) $($loginResponse.lastName)" -ForegroundColor White
    Write-Host "    Role: $($loginResponse.role)" -ForegroundColor White
    $token = $loginResponse.token
} catch {
    Write-Host "  ✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 3: Protected Endpoint
Write-Host "`n[3/3] Testing PROTECTED endpoint..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $users = Invoke-RestMethod -Uri "$baseUrl/users" -Method GET -Headers $headers
    Write-Host "  ✓ Protected endpoint accessible!" -ForegroundColor Green
    Write-Host "    Total users: $($users.Count)" -ForegroundColor White
} catch {
    Write-Host "  ✗ Protected endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  ALL TESTS PASSED! ✓" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nTest Account:" -ForegroundColor Cyan
Write-Host "  Email: $randomEmail" -ForegroundColor White
Write-Host "  Password: test12345" -ForegroundColor White
Write-Host "`nToken (valid for 15 min):" -ForegroundColor Cyan
Write-Host "  $token`n" -ForegroundColor Gray
