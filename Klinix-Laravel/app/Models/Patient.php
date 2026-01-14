<?php

namespace App\Models;

use App\Models\Ciudad;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Patient extends Model
{
    use HasFactory;
    protected $table = 'patients';
    
    public $timestamps = false;

    protected $fillable = [
        'Lastname',
        'Firstname',
        'Title',
        'DocumentNo',
        'Nationality',
        'Birthday',
        'Sex',
        'Photo',
        'Address',
        'City_Id',
        'PhoneNumber',
        'CellPhoneNumber',
        'SupportWhatsapp',
        'Email',
        'Notes',
        'BloodType',
        'RhFactor',
        'Allergies',
        'MaritalStatus',
        'MedicalInsurance',
        'DeathDate',
        'DeathCause',
        'DeathPlace',
        'DeathCertificateNumber',
        'MedicalDiagnosis',
        'District',
        'Neighborhood',
        'PatientCode',
        'Department',
        'UrevUsuario',
        'UrevFechaHora',
        'UrevCalc'
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

        // Relación con Ciudad
        public function ciudad()
        {
            return $this->belongsTo(Ciudad::class, 'City_Id');
        }
    
    

}
