<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add a unique index on user_id to enforce single submission per user
        // If duplicates exist, this will fail; ensure data is clean before running in prod
        Schema::table('application_submissions', function (Blueprint $table) {
            $table->unique('user_id', 'unique_submission_per_user');
        });
    }

    public function down(): void
    {
        Schema::table('application_submissions', function (Blueprint $table) {
            try { $table->dropUnique('unique_submission_per_user'); } catch (\Throwable $e) {}
        });
    }
};


