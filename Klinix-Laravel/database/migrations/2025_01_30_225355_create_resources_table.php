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
        Schema::create('resources', function (Blueprint $table) {
            $table->id();
            $table->integer('ResourceColor')->nullable();
            $table->integer('ResourceImageIndex')->nullable();
            $table->string('ResourceName', 255)->nullable();
            $table->char('ResourceVisible', 1)->nullable();
            $table->integer('ResourceWorkDays')->nullable();
            $table->dateTime('ResourceWorkStart')->nullable();
            $table->dateTime('ResourceWorkFinish')->nullable();
            $table->string('UrevUsuario')->nullable(); 
            $table->dateTime('UrevFechaHora')->nullable();
        });
        DB::statement('ALTER TABLE resources ADD UrevCalc AS (ISNULL(UrevUsuario, \'\') + \' - \' + ISNULL(FORMAT(UrevFechaHora, \'dd/MM/yyyy HH:mm\'), \'\'))');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resources');
    }
};
