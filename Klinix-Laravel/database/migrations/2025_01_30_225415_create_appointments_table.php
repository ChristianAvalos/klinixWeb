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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->integer('Id_Parent')->nullable();
            $table->integer('Id_Group')->nullable();
            $table->integer('EventType')->nullable(false);
            $table->dateTime('Start')->nullable();
            $table->dateTime('Finish')->nullable();
            $table->integer('Options')->nullable();
            $table->string('Caption', 255)->nullable();
            $table->integer('RecurrenceIndex')->nullable();
            $table->text('RecurrenceInfo')->nullable();
            $table->string('Id_Resource', 1000)->nullable();
            $table->string('Location', 255)->nullable();
            $table->string('MessageText', 255)->nullable();
            $table->dateTime('ReminderDate')->nullable();
            $table->integer('ReminderMinutesBeforeStart')->nullable();
            $table->integer('State')->nullable();
            $table->integer('LabelColor')->nullable();
            $table->integer('ActualStart')->nullable();
            $table->integer('ActualFinish')->nullable();
            $table->text('ReminderResourcesData')->nullable();
            $table->integer('TaskComplete')->nullable();
            $table->integer('TaskIndex')->nullable();
            $table->text('TaskLinks')->nullable();
            $table->integer('TaskStatus')->nullable();
            $table->integer('Id_Patient')->nullable();
            $table->integer('Id_Doctor')->nullable();
            $table->string('UrevUsuario')->nullable(); 
            $table->dateTime('UrevFechaHora')->nullable();

            $table->foreign('Id_Patient')->references('id')->on('patients');
            $table->foreign('Id_Doctor')->references('id')->on('doctors');
            $table->foreign('Id_Resource')->references('id')->on('resources');
        });
       // DB::statement('ALTER TABLE appointments ADD UrevCalc AS (ISNULL(UrevUsuario, \'\') + \' - \' + ISNULL(FORMAT(UrevFechaHora, \'dd/MM/yyyy HH:mm\'), \'\'))');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
