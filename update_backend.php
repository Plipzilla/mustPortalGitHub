<?php

/**
 * Backend Update Script
 * Run this script to apply database migrations for the new subjects and grades structure
 */

echo "🚀 Starting Backend Update for Subjects and Grades...\n\n";

// Check if we're in the correct directory
if (!file_exists('artisan')) {
    echo "❌ Error: artisan file not found. Please run this script from the backend directory.\n";
    echo "   cd backend && php update_backend.php\n";
    exit(1);
}

echo "📋 Running database migrations...\n";

// Run the migrations
$output = [];
$returnVar = 0;
exec('php artisan migrate', $output, $returnVar);

if ($returnVar === 0) {
    echo "✅ Migrations completed successfully!\n\n";
    foreach ($output as $line) {
        echo "   $line\n";
    }
} else {
    echo "❌ Migration failed!\n\n";
    foreach ($output as $line) {
        echo "   $line\n";
    }
    exit(1);
}

echo "\n🎉 Backend update completed successfully!\n\n";
echo "📝 Summary of changes:\n";
echo "   • Added 'subjects_and_grades' JSON column to application_drafts table\n";
echo "   • Added 'subjects_and_grades' JSON column to application_submissions table\n";
echo "   • Updated ApplicationDraft model with conversion methods\n";
echo "   • Updated ApplicationController to handle new data structure\n";
echo "   • Maintained backward compatibility with existing data\n\n";

echo "🔄 The frontend now sends structured subject-grade data that is properly stored in the database.\n";
echo "📊 Existing data will be automatically converted when accessed.\n\n";

echo "✨ You can now test the new country dropdown and subject-grade list features!\n"; 