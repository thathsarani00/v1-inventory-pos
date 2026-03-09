#!/bin/bash
echo "=== Uploading CORS fix to server ==="

# Upload fixed CORS config
scp -r backend/src/main/java/com/inventory/backend/config/CorsConfig.java \
    root@45.8.149.194:/root/v1-inventory-pos/backend/src/main/java/com/inventory/backend/config/

echo ""
echo "=== Rebuilding application on server ==="
ssh root@45 8.149.194 << 'EOF'
cd /root/v1-inventory-pos
echo "Starting rebuild..."
docker-compose build --no-cache app
echo "Restarting containers..."
docker-compose down
docker-compose up -d
echo "Waiting for startup..."
sleep 15
docker-compose ps
echo ""
echo "=== Testing endpoints ==="
curl -s -o /dev/null -w "Frontend: %{http_code}\n" http://localhost:5555/v1/
curl -s -X POST -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"test123"}' \
     -o /dev/null -w "Login: %{http_code}\n" http://localhost:5555/v1/auth/login
echo ""
echo "✓ Deployment complete!"
echo "Access: http://45.8.149.194:5555/v1/"
EOF
