@echo off
echo ======================================
echo Building Single Application
echo Manual frontend build required!
echo ======================================

echo.
echo IMPORTANT: You must build frontend first!
echo.
echo Run these commands:
echo   cd e:\react\react\template
echo   npm install
echo   npm run build
echo.
pause

echo.
echo Step 1: Checking if frontend dist exists...
if exist "..\react\template\dist\" (
    echo OK: Frontend build found!
) else (
    echo ERROR: Frontend dist folder not found!
    echo Please build frontend first: cd ..\react\template ^&^& npm run build
    pause
    exit /b 1
)

echo.
echo Step 2: Cleaning previous backend builds...
call mvn clean

echo.
echo Step 3: Building Backend (Spring Boot)...
echo Frontend will be embedded from ../react/template/dist/

call mvn package -DskipTests

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================
    echo Build Successful!
    echo ======================================
    echo.
    echo JAR file location: target\backend-1.0.0.jar
    echo.
    echo To run the application:
    echo   java -jar target\backend-1.0.0.jar
    echo.
    echo Then access:
    echo   Frontend: http://localhost:5555/
    echo   API: http://localhost:5555/v1/
    echo.
) else (
    echo.
    echo ERROR: Build failed. Check errors above.
    exit /b 1
)
