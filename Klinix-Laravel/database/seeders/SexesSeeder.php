<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Sexes;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class SexesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Sexes::insert([
            ['name' => 'Femenino',            
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['name' => 'Masculino',            
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
        ]);
    }
}
