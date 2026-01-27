<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\Patient;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Sexes extends Model
{
    use HasFactory;
    protected $table = 'sexes';
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

    public function Patient()
    {
        return $this->hasMany(Patient::class, 'Id_Sex');
    }
}
