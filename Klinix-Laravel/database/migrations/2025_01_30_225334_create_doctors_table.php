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

        Schema::create('doctors', function (Blueprint $table) use ($isSqlsrv) {
            $table->id();

            $column = $table->string('LastName', 150)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('FirstName', 150)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('Address', 250)->nullable();
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

            $table->string('UrevUsuario')->nullable(); 
            $table->dateTime('UrevFechaHora')->nullable();

            $table->foreign('City_Id')->references('id')->on('ciudad');
        });
       // DB::statement('ALTER TABLE doctors ADD UrevCalc AS (ISNULL(UrevUsuario, \'\') + \' - \' + ISNULL(FORMAT(UrevFechaHora, \'dd/MM/yyyy HH:mm\'), \'\'))');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
