<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TypePeople;
use Carbon\Carbon;

class TypePeopleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TypePeople::insert([
            ['name' => 'Acompañante',            
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['name' => 'Paciente',            
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
        ]);
    }
}
