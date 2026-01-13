<?php

namespace App\Models;

use App\Models\Departamento;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ciudad extends Model
{
    use HasFactory;
    protected $table = 'ciudad';

    protected $fillable = [
        'nombre',
        'departamento_id',
        'UrevUsuario',
        'UrevFechaHora',
        'UrevCalc',
    ];

    public function departamento()
    {
        return $this->belongsTo(Departamento::class, 'departamento_id');
    }
}
