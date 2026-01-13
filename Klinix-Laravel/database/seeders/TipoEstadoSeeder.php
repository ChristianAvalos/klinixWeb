<?php

namespace Database\Seeders;

use App\Models\TipoEstado;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class TipoEstadoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TipoEstado::insert([
            ['descripcion' => 'Activo'],
            ['descripcion' => 'Inactivo'],
            ['descripcion' => 'Pendiente'],
        ]);
    }
}
