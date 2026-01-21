<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\People;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\CreatePeoplesRequest;
use App\Http\Requests\UpdatePeoplesRequest;

class PeopleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $idTypePeople = $request->input('id_type_people');
        $likeOperator = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        $baseQuery = People::with(['ciudad','sexes','maritalStatus','departamento'])
            ->when($idTypePeople, function ($query, $idTypePeople) {
                return $query->where('Id_Type_People', $idTypePeople);
            })
            ->orderByDesc('id');

        if ($request->query('all')) {
            $pacientes = $baseQuery->get();
        } else {
            $pacientes = $baseQuery
                ->when($search, function ($query, $search) use ($likeOperator) {
                    return $query->where(function ($q) use ($search, $likeOperator) {
                        $q->where('LastName', $likeOperator, '%' . $search . '%')
                            ->orWhere('FirstName', $likeOperator, '%' . $search . '%')
                            ->orWhere('DocumentNo', $likeOperator, '%' . $search . '%');
                    });
                })
                ->paginate(10);
        }

    return response()->json($pacientes);
    }

    public function DeletePersona($id)
    {
        $persona = People::findOrFail($id);
        $persona->delete();
        return response()->json(['message' => 'Persona eliminada correctamente.'], 200);
    }

    // Alias por compatibilidad (si alguna vista antigua lo llama)
    public function DeletePaciente($id)
    {
        return $this->DeletePersona($id);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(CreatePeoplesRequest $request)
    {
        $data = $request->validated();

        // Obtener el usuario autenticado
        $usuarioActual = Auth::user();

        $people = People::create([
            'PatientCode' => $data['PatientCode'] ?? null,
            'FirstName' => $data['FirstName'],
            'LastName' => $data['LastName'],
            'Title' => $data['Title'] ?? null,
            'DocumentNo' => $data['DocumentNo'],
            'Nationality' => $data['Nationality'] ?? null,
            'Birthday' => $data['Birthday'] ?? null,
            'Id_Sex' => $data['Id_Sex'],
            'Address' => $data['Address'] ?? null,
            'Neighborhood' => $data['Neighborhood'] ?? null,
            'District' => $data['District'] ?? null,
            'City_Id' => $data['City_Id'],
            'Id_Department' => $data['Department_Id'],
            'PhoneNumber' => $data['PhoneNumber'] ?? null,
            'CellPhoneNumber' => $data['CellPhoneNumber'] ?? null,
            'SupportWhatsapp' => array_key_exists('SupportWhatsapp', $data)
                ? ($data['SupportWhatsapp'] ? '1' : '0')
                : null,
            'Email' => $data['Email'] ?? null,
            'Notes' => $data['Notes'] ?? null,
            'BloodType' => $data['BloodType'] ?? null,
            'RhFactor' => $data['RHFactor'] ?? null,
            'Allergies' => $data['Allergies'] ?? null,
            'MedicalDiagnosis' => $data['MedicalDiagnosis'] ?? null,
            'MedicalInsurance' => $data['MedicalInsurance'] ?? null,
            'Id_Marital_Status' => $data['MaritalStatus_Id'] ?? null,
            'DeathDate' => $data['DeathDate'] ?? null,
            'DeathCause' => $data['DeathCause'] ?? null,
            'DeathPlace' => $data['DeathPlace'] ?? null,
            'DeathCertificateNumber' => $data['DeathCertificateNumber'] ?? null,

            'Id_Type_People' => $data['Id_Type_People'],

            'UrevUsuario' => 'Registrado - ' . ($usuarioActual ? $usuarioActual->name : 'Desconocido'),
            'UrevFechaHora' => Carbon::now(),
        ]);

        return response()->json($people->load(['ciudad', 'sexes', 'maritalStatus']), 201);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // No se usa actualmente (rutas usan create)
        return response()->json(['message' => 'No implementado.'], 501);
    }

    /**
     * Display the specified resource.
     */
    public function show(People $people)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(People $people)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePeoplesRequest $request, $id)
    {
        $data = $request->validated();

        // Obtener el usuario autenticado
        $usuarioActual = Auth::user();

        $people = People::findOrFail($id);

        $people->update([
            'PatientCode' => $data['PatientCode'] ?? null,
            'FirstName' => $data['FirstName'],
            'LastName' => $data['LastName'],
            'Title' => $data['Title'] ?? null,
            'DocumentNo' => $data['DocumentNo'],
            'Nationality' => $data['Nationality'] ?? null,
            'Birthday' => $data['Birthday'] ?? null,
            'Id_Sex' => $data['Id_Sex'],
            'Address' => $data['Address'] ?? null,
            'Neighborhood' => $data['Neighborhood'] ?? null,
            'District' => $data['District'] ?? null,
            'City_Id' => $data['City_Id'],
            'Id_Department' => $data['Department_Id'],
            'PhoneNumber' => $data['PhoneNumber'] ?? null,
            'CellPhoneNumber' => $data['CellPhoneNumber'] ?? null,
            'SupportWhatsapp' => array_key_exists('SupportWhatsapp', $data)
                ? ($data['SupportWhatsapp'] ? '1' : '0')
                : null,
            'Email' => $data['Email'] ?? null,
            'Notes' => $data['Notes'] ?? null,
            'BloodType' => $data['BloodType'] ?? null,
            'RhFactor' => $data['RHFactor'] ?? null,
            'Allergies' => $data['Allergies'] ?? null,
            'MedicalDiagnosis' => $data['MedicalDiagnosis'] ?? null,
            'MedicalInsurance' => $data['MedicalInsurance'] ?? null,
            'Id_Marital_Status' => $data['MaritalStatus_Id'] ?? null,
            'DeathDate' => $data['DeathDate'] ?? null,
            'DeathCause' => $data['DeathCause'] ?? null,
            'DeathPlace' => $data['DeathPlace'] ?? null,
            'DeathCertificateNumber' => $data['DeathCertificateNumber'] ?? null,

            'Id_Type_People' => $data['Id_Type_People'],

            'UrevUsuario' => 'Actualizado - ' . ($usuarioActual ? $usuarioActual->name : 'Desconocido'),
            'UrevFechaHora' => Carbon::now(),
        ]);

        return response()->json($people->load(['ciudad', 'sexes', 'maritalStatus']), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(People $people)
    {
        //
    }
}
