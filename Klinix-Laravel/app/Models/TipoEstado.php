<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TipoEstado extends Model
{
    use HasFactory;
    protected $fillable = [
        'descripcion'
    ];




    /**
     * Relación con los usuarios: un estado puede tener muchos usuarios.
     */
    public function users()
    {
        return $this->hasMany(User::class, 'id_tipoestado');
    }
}
