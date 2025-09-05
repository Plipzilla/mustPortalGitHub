<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Note: We are NOT changing draft uniqueness at the DB level to avoid FK/index conflicts.
        // The application layer enforces a single draft per user.

        // Payment references: add FK to users and index used_by_user_id
        Schema::table('payment_references', function (Blueprint $table) {
            if (!Schema::hasColumn('payment_references', 'used_by_user_id')) {
                $table->unsignedBigInteger('used_by_user_id')->nullable()->after('status');
            }
            $table->index('used_by_user_id', 'idx_payment_refs_used_by');
        });

        // Add FK in a separate call to avoid issues if existing data violates constraint
        try {
            Schema::table('payment_references', function (Blueprint $table) {
                $table->foreign('used_by_user_id')->references('id')->on('users')->nullOnDelete();
            });
        } catch (\Throwable $e) {
            // If existing orphan values exist, FK may fail; admin can clean and re-add later
        }
    }

    public function down(): void
    {
        Schema::table('payment_references', function (Blueprint $table) {
            try { $table->dropForeign(['used_by_user_id']); } catch (\Throwable $e) {}
            try { $table->dropIndex('idx_payment_refs_used_by'); } catch (\Throwable $e) {}
        });
    }
};


