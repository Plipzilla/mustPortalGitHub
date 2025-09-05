<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('application_drafts', function (Blueprint $table) {
            // Add unique constraint to ensure only one draft per user per application type
            // This will also create an index, so we don't need to drop the existing one
            $table->unique(['user_id', 'application_type'], 'unique_user_application_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('application_drafts', function (Blueprint $table) {
            // Remove the unique constraint
            $table->dropUnique('unique_user_application_type');
        });
    }
};
