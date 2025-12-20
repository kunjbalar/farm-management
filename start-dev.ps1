# Farm Management - Development Server Starter
# This script starts the development server on Windows

Write-Host "Starting Farm Management Development Server..." -ForegroundColor Green
Write-Host "Server will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""

# Set environment variable
$env:NODE_ENV = 'development'

# Start the server
npx tsx server/index.ts
