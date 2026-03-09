# Frontend Deployment Script
Write-Host "`n=== Frontend Deployment to Port 3000 ===`n" -ForegroundColor Magenta

$SERVER = "root@45.8.149.194"

# Step 1: Upload built frontend
Write-Host "📤 Uploading frontend files..." -ForegroundColor Cyan
scp -r E:\react\react\template\dist\* ${SERVER}:/root/frontend/dist/

# Step 2: Create nginx config on server
Write-Host "🔧 Creating nginx configuration..." -ForegroundColor Cyan
ssh $SERVER @"
cd /root/frontend
cat > nginx.conf << 'EOF'
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
"@

# Step 3: Create docker-compose
Write-Host "🐳 Creating docker-compose..." -ForegroundColor Cyan
ssh $SERVER @"
cd /root/frontend
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
"@

# Step 4: Start frontend
Write-Host "🚀 Starting frontend on port 3000..." -ForegroundColor Cyan
ssh $SERVER "cd /root/frontend && docker-compose up -d"

# Step 5: Rebuild backend with new CORS
Write-Host "🔄 Updating backend CORS..." -ForegroundColor Cyan
ssh $SERVER "cd /root/v1-inventory-pos && docker-compose stop app && docker-compose build app && docker-compose up -d app"

Write-Host "`n✅ Deployment Complete!`n" -ForegroundColor Green
Write-Host "Frontend: http://45.8.149.194:3000" -ForegroundColor Yellow
Write-Host "Backend:  http://45.8.149.194:5555/v1`n" -ForegroundColor Yellow
