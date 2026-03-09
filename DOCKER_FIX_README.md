# Docker Build Fix Instructions

## Problem
Docker build fails because cached Node 18 image is being used, but dependencies require Node 20+.

## Solution

### Option 1: Run Locally (Windows PowerShell)
```powershell
# Navigate to project directory
cd e:\react

# Run the fix script
.\fix-docker-build.ps1
```

### Option 2: Run on Remote Server (SSH)

#### Step 1: Connect to Server
```bash
ssh root@45.8.149.194
```

#### Step 2: Navigate to Project Directory
```bash
cd /path/to/your/project
```

#### Step 3: Run Build Fix
```bash
# Make script executable
chmod +x fix-docker-build.sh

# Run the script
./fix-docker-build.sh
```

OR manually run commands:
```bash
# Stop containers
docker-compose down

# Build without cache
docker-compose build --no-cache

# Start containers
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app
```

### Option 3: Copy Files to Remote Server

#### Copy via SCP (from Windows)
```powershell
# Copy docker-compose.yml
scp e:\react\docker-compose.yml root@45.8.149.194:/path/to/project/

# Copy Dockerfile
scp e:\react\backend\Dockerfile root@45.8.149.194:/path/to/project/backend/

# Copy fix script
scp e:\react\fix-docker-build.sh root@45.8.149.194:/path/to/project/
```

#### Copy via WinSCP or FileZilla
- Host: 45.8.149.194
- Username: root
- Protocol: SFTP or SCP
- Upload files to project directory

## Verify Node Version in Container

After building, verify the Node version:
```bash
docker-compose exec app node --version
# Should show: v20.x.x
```

## Troubleshooting

### If build still fails:
```bash
# Complete cleanup
docker-compose down
docker system prune -a
docker volume prune

# Rebuild
docker-compose up --build
```

### Check logs for errors:
```bash
# All logs
docker-compose logs

# App logs only
docker-compose logs app

# Follow logs (real-time)
docker-compose logs -f app
```

### Check running containers:
```bash
docker-compose ps
docker ps -a
```

## Expected Result
- MySQL container running on port 3306
- App container running on port 5555
- Application accessible at: http://45.8.149.194:5555 (or http://localhost:5555 if local)

## Common Issues

1. **Port already in use**: Stop conflicting services or change port in docker-compose.yml
2. **MySQL not ready**: Wait for healthcheck to pass (check with `docker-compose logs mysql`)
3. **Build timeout**: Increase Docker build timeout or improve network connection
4. **Permission denied**: Run with sudo or add user to docker group

## Additional Commands

```bash
# Restart specific service
docker-compose restart app

# Rebuild specific service
docker-compose up -d --build app

# Remove all containers and volumes
docker-compose down -v

# View container resource usage
docker stats

# Execute command in running container
docker-compose exec app bash
```
