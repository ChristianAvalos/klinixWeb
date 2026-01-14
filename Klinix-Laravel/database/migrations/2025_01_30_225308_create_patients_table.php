<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $isSqlsrv = DB::connection()->getDriverName() === 'sqlsrv';

        Schema::create('patients', function (Blueprint $table) use ($isSqlsrv) {
            $table->id('id');

            $column = $table->string('Lastname', 150);
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('Firstname', 150);
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('Title', 30)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('DocumentNo', 30)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('Nationality', 100)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $table->dateTime('Birthday')->nullable();

            $column = $table->char('Sex', 1)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $table->binary('Photo')->nullable();

            $column = $table->string('Address', 250)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            //Esto creo para que luego pueda ser eliminado si no se necesita

            $column = $table->string('City', 50)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $table->bigInteger('City_Id')->nullable();

            $column = $table->string('PhoneNumber', 30)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('CellPhoneNumber', 30)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->char('SupportWhatsapp', 1)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('Email', 200)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('Notes', 1000)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('BloodType', 2)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('RhFactor', 1)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('Allergies', 500)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->char('MaritalStatus', 1)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('MedicalInsurance', 500)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $table->dateTime('DeathDate')->nullable();

            $column = $table->string('DeathCause', 500)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('DeathPlace', 100)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('DeathCertificateNumber', 255)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('MedicalDiagnosis', 500)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('District', 100)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('Neighborhood', 150)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('PatientCode', 10)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('Department', 100)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $table->string('UrevUsuario')->nullable(); 
            $table->dateTime('UrevFechaHora')->nullable();
        });
        //DB::statement('ALTER TABLE patients ADD UrevCalc AS (ISNULL(UrevUsuario, \'\') + \' - \' + ISNULL(FORMAT(UrevFechaHora, \'dd/MM/yyyy HH:mm\'), \'\'))');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
