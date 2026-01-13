<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'UrevUsuario',
        'UrevFechaHora'
    ];

    /**
     * Relación con los roles: un permiso puede pertenecer a muchos roles.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_permission', 'permission_id', 'rol_id');
    }
}
