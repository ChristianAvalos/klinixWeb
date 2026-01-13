<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function ObtenerPermisosRole($roleId)
    {
        $role = Role::with('permissions')->findOrFail($roleId);
        $permissions = Permission::all();

        return response()->json([
            'permissions' => $permissions,
            'rolePermissions' => $role->permissions->pluck('id')->toArray(),
        ]);
    }

    public function ActualizarPermisos(Request $request, $roleId)
    {
        $role = Role::findOrFail($roleId);
        $role->permissions()->sync($request->permissions);

        return response()->json(['success' => true]);
    }
}
