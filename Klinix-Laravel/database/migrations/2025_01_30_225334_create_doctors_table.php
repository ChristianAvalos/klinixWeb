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
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->string('Lastname', 150)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->string('Firstname', 150)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->string('Address', 250)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->bigInteger('City_Id')->nullable();
            $table->string('PhoneNumber', 30)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->string('CellPhoneNumber', 30)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->char('SupportWhatsapp', 1)->collation('Modern_Spanish_CI_AS')->nullable();
            $table->string('Email', 200)->collation('Modern_Spanish_CI_AS')->nullable();
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
