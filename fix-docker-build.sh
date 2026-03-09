#!/bin/bash

# Docker Build Fix Script for Linux/Remote Server
# This script rebuilds Docker containers without cache to fix Node version issues

echo "=== Docker Build Fix Script ==="
echo ""

# Stop running containers
echo "Step 1: Stopping running containers..."
docker-compose down

# Optional: Clean up old images and containers
# Uncomment the following lines if you want a complete clean
# echo "Step 2: Cleaning up Docker system..."
# docker system prune -a -f

# Build without cache
echo "Step 2: Building without cache (this may take a while)..."
docker-compose build --no-cache

# Start containers
echo "Step 3: Starting containers..."
docker-compose up -d

# Show container status
echo ""
echo "Step 4: Container Status:"
docker-compose ps

echo ""
echo "=== Build Complete ==="
echo "Check logs with: docker-compose logs -f app"
echo "Access application at: http://localhost:5555"
