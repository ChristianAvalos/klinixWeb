<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\PaisSeeder;
use Database\Seeders\RolesSeeder;
use Database\Seeders\TipoEstadoSeeder;
use Database\Seeders\TypePeopleSeeder;
use Database\Seeders\UserAdministrador;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\CiudadesYdepartamentos;
use Database\Seeders\PermissionsTableSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RolesSeeder::class);
        $this->call(TipoEstadoSeeder::class);
        $this->call(UserAdministrador::class);
        $this->call(PermissionsTableSeeder::class);
        $this->call(RolePermissionSeeder::class);
        $this->call(PaisSeeder::class);
        $this->call(CiudadesYdepartamentos::class);
        $this->call(TypePeopleSeeder::class);
    }
}
