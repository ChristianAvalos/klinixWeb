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
        Schema::create('patients', function (Blueprint $table) {
            $table->id('id');
            $table->string('Lastname', 150)->collation('Modern_Spanish_CI_AS');
            $table->string('Firstname', 150)->collation('Modern_Spanish_CI_AS');
            $table->string('Title', 30)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->string('DocumentNo', 30)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->string('Nationality', 100)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->dateTime('Birthday')->nullable();
            $table->char('Sex', 1)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->binary('Photo')->nullable();
            $table->string('Address', 250)->collation('Modern_Spanish_CI_AS')->nullable();
            //Esto creo para que luego pueda ser eliminado si no se necesita
            $table->string('City', 50)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->bigInteger('City_Id')->nullable();
            $table->string('PhoneNumber', 30)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->string('CellPhoneNumber', 30)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->char('SupportWhatsapp', 1)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->string('Email', 200)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->string('Notes', 1000)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->string('BloodType', 2)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->string('RhFactor', 1)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->string('Allergies', 500)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->char('MaritalStatus', 1)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->string('MedicalInsurance', 500)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->dateTime('DeathDate')->nullable();
            $table->string('DeathCause', 500)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->string('DeathPlace', 100)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->string('DeathCertificateNumber', 255)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->string('MedicalDiagnosis', 500)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->string('District', 100)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->string('Neighborhood', 150)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->string('PatientCode', 10)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->string('Department', 100)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->string('UrevUsuario')->nullable(); 
            $table->dateTime('UrevFechaHora')->nullable();
        });
        DB::statement('ALTER TABLE patients ADD UrevCalc AS (ISNULL(UrevUsuario, \'\') + \' - \' + ISNULL(FORMAT(UrevFechaHora, \'dd/MM/yyyy HH:mm\'), \'\'))');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
