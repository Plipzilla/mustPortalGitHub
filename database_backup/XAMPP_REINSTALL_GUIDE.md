# XAMPP Reinstall Guide for MUST Portal

## 🎯 Goal
Clean reinstall of XAMPP to reset MySQL password and get a fresh start while preserving your application data.

## 📋 Pre-Reinstall Checklist
- ✅ Database backup created: `must_portal_backup.sql` (74KB)
- ✅ Laravel .env backup created: `.env.backup`
- ✅ Restoration script created: `restore_database.ps1`

## 🔄 XAMPP Reinstall Steps

### Step 1: Stop All Services
1. Open XAMPP Control Panel
2. Stop **Apache** and **MySQL** if running
3. Close XAMPP Control Panel

### Step 2: Backup Important Files (Optional)
If you have custom configurations you want to keep:
- `C:\xampp\apache\conf\httpd.conf`
- `C:\xampp\php\php.ini`
- Any custom PHP applications in `C:\xampp\htdocs\`

### Step 3: Uninstall XAMPP
1. Go to **Control Panel** → **Programs and Features**
2. Find **XAMPP** and click **Uninstall**
3. Follow the uninstall wizard
4. **IMPORTANT**: When asked about data, choose **"Keep Data"** if you want to preserve htdocs

### Step 4: Clean Up (Optional but Recommended)
1. Delete `C:\xampp` folder if it still exists
2. Clear any XAMPP registry entries (optional)

### Step 5: Download and Install Fresh XAMPP
1. Download latest XAMPP from: https://www.apachefriends.org/
2. Run installer as **Administrator**
3. Choose components: **Apache**, **MySQL**, **PHP**, **phpMyAdmin**
4. Install to default location: `C:\xampp`

### Step 6: Configure Fresh XAMPP
1. Start XAMPP Control Panel as **Administrator**
2. Start **Apache** and **MySQL**
3. Test phpMyAdmin: http://localhost/phpmyadmin
4. Default credentials should be:
   - Username: `root`
   - Password: (empty/blank)

### Step 7: Restore Your Database
1. Open PowerShell as **Administrator**
2. Navigate to your project:
   ```powershell
   cd "C:\Users\abela\OneDrive\Desktop\UNORG_ must portal"
   ```
3. Run the restoration script:
   ```powershell
   .\database_backup\restore_database.ps1
   ```

### Step 8: Verify Everything Works
1. **Test MySQL**: phpMyAdmin should work with root/blank password
2. **Test Laravel**: `php artisan migrate:status`
3. **Test React**: `npm start`
4. **Test Registration**: Try creating a new user account

## 🚨 Troubleshooting

### If MySQL Won't Start
- Check Windows Services for conflicting MySQL services
- Disable/stop any MySQL80 or other MySQL services
- Restart XAMPP as Administrator

### If phpMyAdmin Shows Errors
- Check `C:\xampp\phpMyAdmin\config.inc.php` for syntax errors
- Ensure MySQL is running on port 3306 (default)

### If Laravel Can't Connect
- Check `.env` file has correct database settings
- Run `php artisan config:clear`
- Verify MySQL is running and accessible

### If Registration Still Fails
- Run `php artisan passport:install` again
- Check Laravel logs: `storage/logs/laravel.log`

## 📁 Backup Contents
Your backup includes:
- **Database**: Complete `must_portal` database with all tables and data
- **Configuration**: Laravel `.env` file with database settings
- **Scripts**: Automated restoration script

## ✅ Success Indicators
After successful restoration:
- ✅ phpMyAdmin accessible at http://localhost/phpmyadmin
- ✅ `must_portal` database visible in phpMyAdmin
- ✅ Laravel migrations show as "Ran"
- ✅ User registration works in React app
- ✅ Admin panel accessible

## 🔧 Manual Restoration (If Script Fails)
If the automated script fails, you can restore manually:

1. **Create database**:
   ```sql
   CREATE DATABASE must_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
   ```

2. **Import backup**:
   ```bash
   C:\xampp\mysql\bin\mysql.exe -u root must_portal < database_backup\must_portal_backup.sql
   ```

3. **Update .env**:
   ```bash
   copy database_backup\.env.backup .env
   ```

4. **Test connection**:
   ```bash
   php artisan migrate:status
   ```

## 📞 Support
If you encounter issues:
1. Check the Laravel logs: `storage/logs/laravel.log`
2. Check MySQL error log: `C:\xampp\mysql\data\mysql_error.log`
3. Verify all services are running in XAMPP Control Panel

---
**Good luck with your XAMPP reinstall! 🚀**
