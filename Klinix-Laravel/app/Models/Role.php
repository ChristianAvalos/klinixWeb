<?php

namespace App\Models;

use Carbon\Carbon;
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

    protected $appends = ['UrevCalc'];
    public function getUrevCalcAttribute()
    {
        // Si no hay fecha, devuelve solo el usuario
        if (empty($this->UrevFechaHora)) {
            return $this->UrevUsuario ?? ''; 
        }
        $fechaFormateada = Carbon::parse($this->UrevFechaHora)->format('d/m/Y H:i');

        return "{$this->UrevUsuario} - {$fechaFormateada}";
    }

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
