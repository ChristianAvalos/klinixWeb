<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Obtén los roles
        $adminRole = Role::where('name', 'Administrador')->first();
        $userRole = Role::where('name', 'Usuario')->first();

        // Permisos a crear
        $permissions = [
            'Principal',
            'Herraminetas_usuarios',
            'Reporte_Usuarios',
            'Organizacion',
            'Visitas',
            'Doctores',
            'Pacientes',
            'Consultorios',
        ];

        foreach ($permissions as $permission) {
            // Crea el permiso
            $perm = Permission::create([
            'name' => $permission,
            'UrevUsuario' => 'Admin', 
            'UrevFechaHora' => Carbon::now()
            ]);

            // Asocia el permiso con el rol de administrador
            $adminRole->permissions()->attach($perm->id,[
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'UrevUsuario' => 'Admin',
                'UrevFechaHora' => Carbon::now(),
            ]); 
        }

        // // Asocia permisos específicos con el rol de usuario
        // $userRole->permissions()->attach(Permission::where('name', 'ver_reportes')->first()->id,
        // [
        //     'created_at' => Carbon::now(),
        //     'updated_at' => Carbon::now(),
        //     'UrevUsuario' => 'Admin',
        //     'UrevFechaHora' => Carbon::now(),
        // ]
        // );
    }
}

