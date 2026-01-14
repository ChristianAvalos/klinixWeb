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
        Schema::create('visitors', function (Blueprint $table) {
            $table->id();
            $table->dateTime('Datetime');
            $table->string('Type_')->collation('Modern_Spanish_CI_AS');
            $table->string('MRTDs', 300)->collation('Modern_Spanish_CI_AS');
            $table->smallInteger('Angle')->nullable();
            $table->string('DocumentNo', 30)->nullable()->collation('Modern_Spanish_CI_AS');
            $table->string('Familyname', 100)->nullable()->collation('Modern_Spanish_CI_AS');
            $table->string('Givenname', 100)->nullable()->collation('Modern_Spanish_CI_AS');
            $table->string('Nationality', 100)->nullable()->collation('Modern_Spanish_CI_AS');
            $table->dateTime('Birthday')->nullable();
            $table->string('PersonalNo', 30)->nullable()->collation('Modern_Spanish_CI_AS');
            $table->string('Sex', 1)->nullable()->collation('Modern_Spanish_CI_AS');
            $table->dateTime('Dateofexpiry')->nullable();
            $table->string('IssueState', 3)->nullable()->collation('Modern_Spanish_CI_AS');
            $table->string('NativeName', 255)->nullable()->collation('Modern_Spanish_CI_AS');
            $table->char('Checksum', 1)->nullable()->collation('Modern_Spanish_CI_AS');
            $table->string('UrevUsuario')->nullable(); 
            $table->dateTime('UrevFechaHora')->nullable();

        });
        //DB::statement('ALTER TABLE visitors ADD UrevCalc AS (ISNULL(UrevUsuario, \'\') + \' - \' + ISNULL(FORMAT(UrevFechaHora, \'dd/MM/yyyy HH:mm\'), \'\'))');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitors');
    }
};
