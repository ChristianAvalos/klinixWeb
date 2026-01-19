<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PaisSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $paises = [
            ['Name' => 'Argentina', 'GentilicioMasculino' => 'Argentino', 'GentilicioFemenino' => 'Argentina',            
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['Name' => 'Brasil', 'GentilicioMasculino' => 'Brasileño', 'GentilicioFemenino' => 'Brasileña',             
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['Name' => 'Chile', 'GentilicioMasculino' => 'Chileno', 'GentilicioFemenino' => 'Chilena',            
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['Name' => 'Paraguay', 'GentilicioMasculino' => 'Paraguayo', 'GentilicioFemenino' => 'Paraguaya',            
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['Name' => 'Uruguay', 'GentilicioMasculino' => 'Uruguayo', 'GentilicioFemenino' => 'Uruguaya',            
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['Name' => 'España', 'GentilicioMasculino' => 'Español', 'GentilicioFemenino' => 'Española',            
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['Name' => 'Francia', 'GentilicioMasculino' => 'Francés', 'GentilicioFemenino' => 'Francesa',            
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['Name' => 'Italia', 'GentilicioMasculino' => 'Italiano', 'GentilicioFemenino' => 'Italiana',            
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['Name' => 'Estados Unidos', 'GentilicioMasculino' => 'Estadounidense', 'GentilicioFemenino' => 'Estadounidense',            
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['Name' => 'México', 'GentilicioMasculino' => 'Mexicano', 'GentilicioFemenino' => 'Mexicana',            
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['Name' => 'Perú', 'GentilicioMasculino' => 'Peruano', 'GentilicioFemenino' => 'Peruana',            
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['Name' => 'Colombia', 'GentilicioMasculino' => 'Colombiano', 'GentilicioFemenino' => 'Colombiana',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['Name' => 'Venezuela', 'GentilicioMasculino' => 'Venezolano', 'GentilicioFemenino' => 'Venezolana',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['Name' => 'Canadá', 'GentilicioMasculino' => 'Canadiense', 'GentilicioFemenino' => 'Canadiense',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['Name' => 'Japón', 'GentilicioMasculino' => 'Japonés', 'GentilicioFemenino' => 'Japonesa',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['Name' => 'China', 'GentilicioMasculino' => 'Chino', 'GentilicioFemenino' => 'China',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['Name' => 'Alemania', 'GentilicioMasculino' => 'Alemán', 'GentilicioFemenino' => 'Alemana',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['Name' => 'Rusia', 'GentilicioMasculino' => 'Ruso', 'GentilicioFemenino' => 'Rusa',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['Name' => 'Reino Unido', 'GentilicioMasculino' => 'Británico', 'GentilicioFemenino' => 'Británica',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),],
            ['Name' => 'Australia', 'GentilicioMasculino' => 'Australiano', 'GentilicioFemenino' => 'Australiana',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now(),]
        ];
        foreach ($paises as $pais) {
            DB::table('pais')->insert($pais);
        }
    }
}
