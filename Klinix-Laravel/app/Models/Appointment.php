<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $table = 'appointments';

    public $timestamps = false;

    protected $fillable = [
        'Id_Parent',
        'Id_Group',
        'EventType',
        'Start',
        'Finish',
        'Options',
        'Caption',
        'RecurrenceIndex',
        'RecurrenceInfo',
        'Id_Resource',
        'Location',
        'MessageText',
        'ReminderDate',
        'ReminderMinutesBeforeStart',
        'State',
        'LabelColor',
        'ActualStart',
        'ActualFinish',
        'ReminderResourcesData',
        'TaskComplete',
        'TaskIndex',
        'TaskLinks',
        'TaskStatus',
        'Id_Patient',
        'Id_Doctor',
        'UrevUsuario',
        'UrevFechaHora',
    ];

    protected $casts = [
        'Start' => 'datetime',
        'Finish' => 'datetime',
        'ReminderDate' => 'datetime',
        'UrevFechaHora' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(People::class, 'Id_Patient');
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'Id_Doctor');
    }

    public function resource()
    {
        // Nota: en DB es string, pero normalmente guarda el ID numérico del consultorio.
        return $this->belongsTo(Resource::class, 'Id_Resource');
    }
}
