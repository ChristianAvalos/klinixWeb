<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Agrega la FK para estado civil si aún no existe
        if (!Schema::hasColumn('patients', 'Id_Marital_Status')) {
            Schema::table('patients', function (Blueprint $table) {
                $table->unsignedBigInteger('Id_Marital_Status')->nullable()->after('MaritalStatus');
                $table->foreign('Id_Marital_Status')->references('id')->on('marital_statuses');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('patients', 'Id_Marital_Status')) {
            Schema::table('patients', function (Blueprint $table) {
                $table->dropForeign(['Id_Marital_Status']);
                $table->dropColumn('Id_Marital_Status');
            });
        }
    }
};
