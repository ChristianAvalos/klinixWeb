<?php

namespace App\Models;

use App\Models\Ciudad;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Doctor extends Model
{
    use HasFactory;
    protected $table = 'doctors';
    
    public $timestamps = false;

    protected $fillable = [
        'LastName',
        'FirstName',
        'Address',
        'City_Id',
        'PhoneNumber',
        'CellPhoneNumber',
        'SupportWhatsapp',
        'Email',
        'UrevUsuario',
        'UrevFechaHora',
        'UrevCalc'
    ];

    // Relación con Ciudad
    public function ciudad()
    {
        return $this->belongsTo(Ciudad::class, 'City_Id');
    }

}
