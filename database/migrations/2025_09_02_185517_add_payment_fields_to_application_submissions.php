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
        Schema::table('application_submissions', function (Blueprint $table) {
            if (!Schema::hasColumn('application_submissions', 'payment_reference')) {
                $table->string('payment_reference')->nullable()->after('deposit_slip_attached');
            }
            if (!Schema::hasColumn('application_submissions', 'payment_verified')) {
                $table->boolean('payment_verified')->default(false)->after('payment_reference');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('application_submissions', function (Blueprint $table) {
            $table->dropColumn(['payment_reference', 'payment_verified']);
        });
    }
};
