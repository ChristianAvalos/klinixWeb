<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreDoctorRequest;
use App\Http\Requests\UpdateDoctorRequest;

class DoctorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $searchNormalized = is_string($search) ? preg_replace('/\s+/', ' ', trim($search)) : null;
        $searchTerms = $searchNormalized ? preg_split('/\s+/', $searchNormalized, -1, PREG_SPLIT_NO_EMPTY) : [];

        if ($request->query('all')) {
            $doctores = Doctor::with(['ciudad'])->get();
        } else {
            $doctores = Doctor::with(['ciudad'])
                ->when($searchTerms, function ($query, $searchTerms) {
                    return $query->where(function ($q) use ($searchTerms) {
                        foreach ($searchTerms as $term) {
                            $like = '%' . $term . '%';
                            $q->where(function ($qq) use ($like) {
                            $qq->where('LastName', 'ilike', $like)
                                ->orWhere('FirstName', 'ilike', $like)
                                ->orWhereRaw('concat_ws(\' \', "FirstName", "LastName") ILIKE ?', [$like])
                                ->orWhereRaw('concat_ws(\' \', "LastName", "FirstName") ILIKE ?', [$like]);
                            });
                        }
                    });
                })
                ->paginate(10);
        }

return response()->json($doctores);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(StoreDoctorRequest $request)
    {
        //validar el registro 

        $data = $request->validated();

        // Obtener el usuario autenticado
        $usuarioActual = Auth::user(); 

        //crear doctor
        $doctor = Doctor::create(
            [
                'FirstName' => $data['FirstName'],
                'LastName' => $data['LastName'],
                'Address' => $data['Address'],
                'CellPhoneNumber' => $data['CellPhoneNumber'],
                'SupportWhatsapp' => $data['SupportWhatsapp'] ? '1' : '0',
                'PhoneNumber' => $data['PhoneNumber'],
                'Email' => $data['email'],
                'City_Id' => $data['City_Id'],
                'UrevUsuario' => 'Registrado - ' . ($usuarioActual ? $usuarioActual->name : 'Desconocido'),
                'UrevFechaHora' => Carbon::now()
            ]
        );
        //retorna una respuesta
        return response()->json($doctor, 201);

    }
    public function DeleteDoctor($id)
    {      
        //Busco el doctor
        $doctor = Doctor::findOrFail($id);
        //Elimino el doctor
        $doctor->delete();
        //Retorno un mensaje de confirmación
        return response()->json(['message' => 'Doctor eliminado correctamente.'],200);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDoctorRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Doctor $doctor)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Doctor $doctor)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDoctorRequest $request,$id)
    {
        //validar el registro 

        $data = $request->validated();

        // Obtener el usuario autenticado
        $usuarioActual = Auth::user(); 

        // Encontrar el doctor por su ID
        $doctor = Doctor::findOrFail($id);

        //actualizar doctor
        $doctor->update(
            [
                'FirstName' => $data['FirstName'],
                'LastName' => $data['LastName'],
                'Address' => $data['Address'],
                'CellPhoneNumber' => $data['CellPhoneNumber'],
                'SupportWhatsapp' => $data['SupportWhatsapp'] ? '1' : '0',
                'PhoneNumber' => $data['PhoneNumber'],
                'Email' => $data['email'],
                'City_Id' => $data['City_Id'],
                'UrevUsuario' => 'Actualizado - ' . ($usuarioActual ? $usuarioActual->name : 'Desconocido'),
                'UrevFechaHora' => Carbon::now()
            ]
        );
        //retorna una respuesta
        return response()->json($doctor, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Doctor $doctor)
    {
        //
    }
}
