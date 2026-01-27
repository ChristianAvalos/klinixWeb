<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\Sexes;
use App\Models\Ciudad;
use App\Models\TypePeople;
use App\Models\Departamento;
use App\Models\MaritalStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Patient extends Model
{
    use HasFactory;
    protected $table = 'patients';
    
    public $timestamps = false;

    protected $fillable = [
        'LastName',
        'FirstName',
        'Title',
        'DocumentNo',
        'Nationality',
        'Birthday',
        'Id_Sex',
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
        'Id_Marital_Status',
        'MedicalInsurance',
        'DeathDate',
        'DeathCause',
        'DeathPlace',
        'DeathCertificateNumber',
        'MedicalDiagnosis',
        'District',
        'Neighborhood',
        'PatientCode',
        'Id_Department',
        'MRTDs',
        'PatientNo',
        'Id_Type_People',
        'UrevUsuario',
        'UrevFechaHora'
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

        //Relacion con tipo persona
        public function typePeople()
        {
            return $this->belongsTo(TypePeople::class, 'Id_Type_People');
        }

        //relacion con departamentos 
        public function departamento()
        {
            return $this->belongsTo(Departamento::class, 'Id_Department');
        }

        // Relacion con Sexes
        public function sexes()
        {
            return $this->belongsTo(Sexes::class, 'Id_Sex');
        }

        // Relacion con MaritalStatus
        public function maritalStatus()
        {
            return $this->belongsTo(MaritalStatus::class, 'Id_Marital_Status');
        }
}