# Upload fixed files to server

$server = "root@45.8.149.194"
$remotePath = "/root/v1-inventory-pos"

Write-Host "Uploading fixed files to server..." -ForegroundColor Green

# Upload PermissionContext.tsx
Write-Host "Uploading PermissionContext.tsx..."
scp "react\template\src\context\PermissionContext.tsx" "${server}:${remotePath}/react/template/src/context/"

# Upload register.tsx
Write-Host "Uploading register.tsx..."
scp "react\template\src\feature-module\pages\authentication\register\register.tsx" "${server}:${remotePath}/react/template/src/feature-module/pages/authentication/register/"

Write-Host "`nFiles uploaded successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. SSH to server: ssh root@45.8.149.194"
Write-Host "2. cd v1-inventory-pos"
Write-Host "3. docker-compose build"
Write-Host "4. docker-compose up -d"
Write-Host "5. Access: http://45.8.149.194:5555"
