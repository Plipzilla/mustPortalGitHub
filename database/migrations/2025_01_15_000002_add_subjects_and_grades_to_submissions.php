<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('application_submissions', function (Blueprint $table) {
            // Add new JSON column for structured subjects and grades
            $table->json('subjects_and_grades')->nullable()->after('grades_achieved');
        });
    }

    public function down()
    {
        Schema::table('application_submissions', function (Blueprint $table) {
            $table->dropColumn('subjects_and_grades');
        });
    }
}; 