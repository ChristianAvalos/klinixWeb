<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'UrevUsuario',
        'UrevFechaHora'
    ];

        /**
     * Relación con los permisos: un rol puede tener muchos permisos.
     */
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permission', 'rol_id', 'permission_id');
    }

    /**
     * Relación con los usuarios: un rol puede tener muchos usuarios.
     */
    public function users()
    {
        return $this->hasMany(User::class, 'rol_id');
    }
}
