<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pais extends Model
{
    use HasFactory;
    protected $table = 'pais';
    protected $fillable = [
        'Name',
        'GentilicioMasculino',
        'GentilicioFemenino',
        'UrevUsuario',
        'UrevFechaHora',
        'UrevCalc'
    ];
}
