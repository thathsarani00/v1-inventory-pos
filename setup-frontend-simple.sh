#!/bin/bash

cd /root/frontend

# Create nginx.conf
cat > nginx.conf << 'EOFNGINX'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOFNGINX

# Create docker-compose.yml
cat > docker-compose.yml << 'EOFCOMPOSE'
version: "3.8"
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
EOFCOMPOSE

echo "Configuration files created:"
ls -la

# Start frontend
docker-compose up -d

echo "Frontend container started on port 3000"
docker ps --filter name=inventory-frontend
