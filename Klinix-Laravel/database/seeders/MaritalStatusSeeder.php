<?php

namespace Database\Seeders;

use App\Models\MaritalStatus;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MaritalStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MaritalStatus::insert([
            ['name' => 'Soltero',            
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['name' => 'Casado',            
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['name' => 'Divorciado',            
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['name' => 'Viudo',            
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['name' => 'Otros',            
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
        ]);
    }
}
