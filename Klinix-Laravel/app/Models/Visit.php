<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\Sexes;
use App\Models\Ciudad;
use App\Models\Departamento;
use App\Models\MaritalStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Visit extends Model
{
    use HasFactory;
    protected $table = 'visits';
    
    public $timestamps = false;

    protected $fillable = [
        "Datetime",
        "Type_",
        "MRTDs",
        "Angle",
        "DocumentNo",
        "Familyname",
        "Givenname",
        "Nationality",
        "Birthday",
        "PersonalNo",
        "Sex",
        "Dateofexpiry",
        "IssueState",
        "NativeName",
        "Checksum",
        "UrevUsuario",
        "UrevFechaHora"
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

       
}
