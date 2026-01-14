<?php

namespace App\Models;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TipoEstado extends Model
{
    use HasFactory;
    protected $fillable = [
        'descripcion'
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
     * Relación con los usuarios: un estado puede tener muchos usuarios.
     */
    public function users()
    {
        return $this->hasMany(User::class, 'id_tipoestado');
    }
}
