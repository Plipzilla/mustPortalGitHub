<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('application_drafts', function (Blueprint $table) {
            if (!Schema::hasColumn('application_drafts', 'payment_reference')) {
                $table->string('payment_reference')->nullable()->after('deposit_slip_attached');
            }
        });
    }

    public function down(): void
    {
        Schema::table('application_drafts', function (Blueprint $table) {
            if (Schema::hasColumn('application_drafts', 'payment_reference')) {
                $table->dropColumn('payment_reference');
            }
        });
    }
};


