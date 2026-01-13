<?php

namespace App\Models;

use App\Models\Pais;
use App\Models\User;
use App\Models\Ciudad;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Organizacion extends Model
{
    use HasFactory;
    protected $table = 'organizacion';
    protected $fillable = [
            'RazonSocial',
            'RUC',
            'Direccion',
            'Ciudad_id',
            'Pais_id',
            'Telefono1',
            'Telefono2',
            'Fax1',
            'Fax2',
            'Email',
            'Sigla',
            'SitioWeb',
            'Imagen',
            'UrevUsuario',
            'UrevFechaHora',
    ];
    protected $appends = ['Telefono', 'Fax'];
    
    // Relación con Ciudad
    public function ciudad()
    {
        return $this->belongsTo(Ciudad::class, 'Ciudad_id');
    }
    // Relación con Pais
    public function pais()
    {
        return $this->belongsTo(Pais::class, 'Pais_id');
    }
    // Accesor para Telefono
    public function getTelefonoAttribute()
    {
        $telefono1 = $this->Telefono1 ?? '';
        $telefono2 = $this->Telefono2 ?? '';
        return trim("$telefono1 - $telefono2", ' - ');
    }

    // Accesor para Fax
    public function getFaxAttribute()
    {
        $fax1 = $this->Fax1 ?? '';
        $fax2 = $this->Fax2 ?? '';
        return trim("$fax1 - $fax2", ' - ');
    }
        /**
     * Relación con los usuarios: una organizacion puede tener muchos usuarios.
     */
    public function users()
    {
        return $this->hasMany(User::class, 'organizacion_id');
    }
}
