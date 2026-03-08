# Build script for local development
# Run this from the backend directory: cd backend && ./build.sh

echo "======================================"
echo "Building Single Application"
echo "Frontend + Backend in one JAR"
echo "======================================"

# Check if Maven is installed
if ! command -v mvn &> /dev/null
then
    echo "❌ Maven is not installed. Please install Maven 3.6+"
    exit 1
fi

# Check if Node is installed
if ! command -v node &> /dev/null
then
    echo "⚠️  Node.js not found. Maven will download and use embedded Node."
fi

echo ""
echo "Step 1: Cleaning previous builds..."
mvn clean

echo ""
echo "Step 2: Building Frontend (React)..."
echo "This may take a few minutes on first run..."

echo ""
echo "Step 3: Building Backend (Spring Boot)..."
echo "Frontend will be embedded in JAR..."

mvn package -DskipTests -Pbuild-frontend

if [ $? -eq 0 ]; then
    echo ""
    echo "======================================"
    echo "✅ Build Successful!"
    echo "======================================"
    echo ""
    echo "JAR file location: target/backend-1.0.0.jar"
    echo ""
    echo "To run the application:"
    echo "  java -jar target/backend-1.0.0.jar"
    echo ""
    echo "Then access:"
    echo "  Frontend: http://localhost:5555/"
    echo "  API: http://localhost:5555/v1/"
    echo ""
else
    echo ""
    echo "❌ Build failed. Check errors above."
    exit 1
fi
