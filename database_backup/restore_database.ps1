# Database Restoration Script for MUST Portal
# Run this AFTER reinstalling XAMPP

Write-Host "=== MUST Portal Database Restoration ===" -ForegroundColor Green
Write-Host "This script will restore your database after XAMPP reinstall" -ForegroundColor Yellow

# Check if MySQL is running
Write-Host "`n1. Checking MySQL connection..." -ForegroundColor Yellow
try {
    $testConnection = C:\xampp\mysql\bin\mysql.exe -u root -e "SELECT 1;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ MySQL is running on default port 3306" -ForegroundColor Green
        $mysqlPort = ""
    } else {
        $testConnection = C:\xampp\mysql\bin\mysql.exe -u root -P 3307 -e "SELECT 1;" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✓ MySQL is running on port 3307" -ForegroundColor Green
            $mysqlPort = "-P 3307"
        } else {
            Write-Host "   ✗ MySQL is not running. Please start XAMPP MySQL first." -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host "   ✗ MySQL connection failed. Please start XAMPP MySQL first." -ForegroundColor Red
    exit 1
}

# Create database
Write-Host "`n2. Creating must_portal database..." -ForegroundColor Yellow
try {
    C:\xampp\mysql\bin\mysql.exe -u root $mysqlPort -e "CREATE DATABASE IF NOT EXISTS must_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
    Write-Host "   ✓ Database created successfully" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Failed to create database" -ForegroundColor Red
    exit 1
}

# Restore database
Write-Host "`n3. Restoring database from backup..." -ForegroundColor Yellow
$backupFile = "C:\Users\abela\OneDrive\Desktop\UNORG_ must portal\database_backup\must_portal_backup.sql"
if (Test-Path $backupFile) {
    try {
        C:\xampp\mysql\bin\mysql.exe -u root $mysqlPort must_portal < $backupFile
        Write-Host "   ✓ Database restored successfully" -ForegroundColor Green
    } catch {
        Write-Host "   ✗ Failed to restore database" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   ✗ Backup file not found: $backupFile" -ForegroundColor Red
    exit 1
}

# Update .env file
Write-Host "`n4. Updating Laravel configuration..." -ForegroundColor Yellow
$envFile = "C:\Users\abela\OneDrive\Desktop\UNORG_ must portal\.env"
$envBackup = "C:\Users\abela\OneDrive\Desktop\UNORG_ must portal\database_backup\.env.backup"

if (Test-Path $envBackup) {
    try {
        Copy-Item $envBackup $envFile -Force
        Write-Host "   ✓ .env file restored" -ForegroundColor Green
    } catch {
        Write-Host "   ✗ Failed to restore .env file" -ForegroundColor Red
    }
} else {
    Write-Host "   ⚠ .env backup not found, you may need to configure manually" -ForegroundColor Yellow
}

# Test Laravel connection
Write-Host "`n5. Testing Laravel database connection..." -ForegroundColor Yellow
Set-Location "C:\Users\abela\OneDrive\Desktop\UNORG_ must portal"
try {
    php artisan migrate:status | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Laravel can connect to database" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Laravel connection failed" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ Laravel connection test failed" -ForegroundColor Red
}

Write-Host "`n=== Restoration Complete ===" -ForegroundColor Green
Write-Host "Your MUST Portal database has been restored!" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Start Laravel server: php artisan serve" -ForegroundColor White
Write-Host "2. Start React app: npm start" -ForegroundColor White
Write-Host "3. Test your application" -ForegroundColor White
