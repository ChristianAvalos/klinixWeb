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

        Schema::create('visitors', function (Blueprint $table) use ($isSqlsrv) {
            $table->id();
            $table->dateTime('Datetime');
            $column = $table->string('Type_');
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('MRTDs', 300);
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $table->smallInteger('Angle')->nullable();

            $column = $table->string('DocumentNo', 30)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('Familyname', 100)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('Givenname', 100)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('Nationality', 100)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $table->dateTime('Birthday')->nullable();

            $column = $table->string('PersonalNo', 30)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('Sex', 1)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $table->dateTime('Dateofexpiry')->nullable();

            $column = $table->string('IssueState', 3)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->string('NativeName', 255)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

            $column = $table->char('Checksum', 1)->nullable();
            if ($isSqlsrv) {
                $column->collation('Modern_Spanish_CI_AS');
            }

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
