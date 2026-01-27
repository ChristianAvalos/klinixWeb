<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\Doctor;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Resource extends Model
{
    use HasFactory;
    protected $table = 'resources';
    public $timestamps = false;
    protected $fillable = [
        'ResourceColor',
        'ResourceNumber',
        'ResourceName',
        'ResourceVisible',
        'Id_Doctor',
        'ResourceWorkStart',
        'ResourceWorkFinish',
        'UrevUsuario',
        'UrevFechaHora',
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

    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'Id_Doctor');
    }

    //relacion con la agenda
    public function agenda()
    {
        return $this->hasMany(Appointment::class, 'Id_Resource');
    }
}
