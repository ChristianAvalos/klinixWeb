<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TypePeople extends Model
{
    use HasFactory;
    protected $fillable = [
        'name'
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
    public function people()
    {
        return $this->hasMany(People::class, 'Id_Type_People');
    }
}
