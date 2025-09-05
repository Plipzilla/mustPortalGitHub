<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_references', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->enum('status', ['unused', 'flagged', 'used'])->default('unused');
            $table->unsignedBigInteger('used_by_user_id')->nullable();
            $table->timestamp('used_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_references');
    }
};


