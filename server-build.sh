#!/bin/bash
# Server build automation script

echo "=== Starting Docker Build on Server ==="
echo "Server: 45.8.149.194"
echo "Project: /root/v1-inventory-pos"
echo ""

cd /root/v1-inventory-pos || exit 1

echo "Current directory: $(pwd)"
echo "Starting build at: $(date)"
echo ""

# Build with output logging
docker-compose build 2>&1 | tee "build-$(date +%Y%m%d-%H%M%S).log"

BUILD_STATUS=$?

if [ $BUILD_STATUS -eq 0 ]; then
    echo ""
    echo "=== BUILD SUCCESSFUL ==="
    echo "Starting containers..."
    docker-compose up -d
    
    echo ""
    echo "=== Container Status ==="
    docker-compose ps
    
    echo ""
    echo "=== Application Ready ==="
    echo "Access at: http://45.8.149.194:5555"
else
    echo ""
    echo "=== BUILD FAILED ==="
    echo "Check the log file for details"
    exit 1
fi
