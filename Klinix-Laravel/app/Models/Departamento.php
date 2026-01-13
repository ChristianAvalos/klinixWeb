<?php

namespace App\Models;

use App\Models\Ciudad;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Departamento extends Model
{
    use HasFactory;
    protected $table = 'departamento';
    protected $fillable = [
        'nombre',
        'UrevUsuario',
        'UrevFechaHora',
        'UrevCalc'
    ];



    public function ciudades()
    {
        return $this->hasMany(Ciudad::class, 'departamento_id');
    }
}
