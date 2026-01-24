<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentRequest;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class AppointmentController extends Controller
{
    private function findConflicts(array $data, ?int $ignoreId = null)
    {
        try {
            $start = Carbon::parse($data['Start']);
            $finish = Carbon::parse($data['Finish']);
        } catch (\Throwable $e) {
            return collect();
        }

        $doctorId = $data['Id_Doctor'] ?? null;
        $patientId = $data['Id_Patient'] ?? null;
        $resourceId = array_key_exists('Id_Resource', $data) ? $data['Id_Resource'] : null;

        $query = Appointment::query()
            ->select(['id', 'Start', 'Finish', 'Id_Doctor', 'Id_Patient', 'Id_Resource', 'Caption'])
            ->where('Start', '<', $finish)
            ->where('Finish', '>', $start);

        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        $query->where(function (Builder $q) use ($doctorId, $patientId, $resourceId) {
            if ($doctorId !== null) {
                $q->orWhere('Id_Doctor', $doctorId);
            }
            if ($patientId !== null) {
                $q->orWhere('Id_Patient', $patientId);
            }
            if ($resourceId !== null && $resourceId !== '') {
                // Id_Resource es string en DB
                $q->orWhere('Id_Resource', (string) $resourceId);
            }
        });

        return $query->get();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Appointment::query()
            ->select([
                'id',
                'EventType',
                'Start',
                'Finish',
                'Caption',
                'Id_Patient',
                'Id_Doctor',
                'Id_Resource',
                'Location',
                'MessageText',
                'State',
                'LabelColor',
                'UrevUsuario',
                'UrevFechaHora',
            ])
            ->with([
                'patient:id,FirstName,LastName,DocumentNo',
                'doctor:id,FirstName,LastName',
                'resource:id,ResourceName,ResourceNumber,ResourceColor',
            ])
            ->orderBy('Start');

        $start = request()->query('start');
        $end = request()->query('end');

        // Filtra por solapamiento: Start < end && Finish > start
        if ($start && $end) {
            try {
                $startDt = Carbon::parse($start);
                $endDt = Carbon::parse($end);

                $query->where('Start', '<', $endDt)
                    ->where('Finish', '>', $startDt);
            } catch (\Throwable $e) {
                // Si el parseo falla, devuelve sin filtrar.
            }
        }

        return response()->json($query->get());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAppointmentRequest $request)
    {
        $data = $request->validated();
        $user = $request->user();

        $conflicts = $this->findConflicts($data);
        if ($conflicts->isNotEmpty()) {
            return response()->json([
                'message' => 'Conflicto de horario: doctor/paciente/consultorio ya tiene una cita en ese rango.',
                'errors' => [
                    'Start' => ['Conflicto de horario en el rango seleccionado.'],
                    'Finish' => ['Conflicto de horario en el rango seleccionado.'],
                ],
                'conflicts' => $conflicts,
            ], 422);
        }

        $appointment = Appointment::create([
            'EventType' => $data['EventType'] ?? 0,
            'Start' => $data['Start'],
            'Finish' => $data['Finish'],
            'Caption' => $data['Caption'] ?? null,
            'Id_Patient' => $data['Id_Patient'],
            'Id_Doctor' => $data['Id_Doctor'],
            'Id_Resource' => $data['Id_Resource'] ?? null,
            'Location' => $data['Location'] ?? null,
            'MessageText' => $data['MessageText'] ?? null,
            'State' => $data['State'] ?? null,
            'LabelColor' => $data['LabelColor'] ?? null,
            'UrevUsuario' => $user?->name ?? $user?->email ?? 'Sistema',
            'UrevFechaHora' => Carbon::now(),
        ]);

        return response()->json($appointment->load(['patient', 'doctor', 'resource']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Appointment $appointment)
    {
        return response()->json($appointment->load(['patient', 'doctor', 'resource']));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Appointment $appointment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAppointmentRequest $request, Appointment $appointment)
    {
        $data = $request->validated();
        $user = $request->user();

        $conflicts = $this->findConflicts($data, (int) $appointment->id);
        if ($conflicts->isNotEmpty()) {
            return response()->json([
                'message' => 'Conflicto de horario: doctor/paciente/consultorio ya tiene una cita en ese rango.',
                'errors' => [
                    'Start' => ['Conflicto de horario en el rango seleccionado.'],
                    'Finish' => ['Conflicto de horario en el rango seleccionado.'],
                ],
                'conflicts' => $conflicts,
            ], 422);
        }

        $appointment->update([
            'EventType' => $data['EventType'] ?? $appointment->EventType,
            'Start' => $data['Start'],
            'Finish' => $data['Finish'],
            'Caption' => array_key_exists('Caption', $data) ? $data['Caption'] : $appointment->Caption,
            'Id_Patient' => $data['Id_Patient'],
            'Id_Doctor' => $data['Id_Doctor'],
            'Id_Resource' => array_key_exists('Id_Resource', $data) ? $data['Id_Resource'] : $appointment->Id_Resource,
            'Location' => array_key_exists('Location', $data) ? $data['Location'] : $appointment->Location,
            'MessageText' => array_key_exists('MessageText', $data) ? $data['MessageText'] : $appointment->MessageText,
            'State' => array_key_exists('State', $data) ? $data['State'] : $appointment->State,
            'LabelColor' => array_key_exists('LabelColor', $data) ? $data['LabelColor'] : $appointment->LabelColor,
            'UrevUsuario' => $user?->name ?? $user?->email ?? 'Sistema',
            'UrevFechaHora' => Carbon::now(),
        ]);

        return response()->json($appointment->load(['patient', 'doctor', 'resource']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Appointment $appointment)
    {
        $appointment->delete();
        return response()->json(['message' => 'Appointment eliminado correctamente.'], 200);
    }
}
