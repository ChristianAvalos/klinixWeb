<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Visit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\CreateVisitsRequest;
use App\Http\Requests\UpdateVisitsRequest;

class VisitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $search = $request->input('search');
        $searchNormalized = is_string($search) ? preg_replace('/\s+/', ' ', trim($search)) : null;
        $searchTerms = $searchNormalized ? preg_split('/\s+/', $searchNormalized, -1, PREG_SPLIT_NO_EMPTY) : [];
        $likeOperator = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        $baseQuery = Visit::query()
            ->orderByDesc('id');

        if ($request->query('all')) {
            $visits = $baseQuery->get();
        } else {
            $visits = $baseQuery
                ->when($searchTerms, function ($query, $searchTerms) use ($likeOperator) {
                    return $query->where(function ($q) use ($searchTerms, $likeOperator) {
                        foreach ($searchTerms as $term) {
                            $like = '%' . $term . '%';
                            $q->where(function ($qq) use ($like, $likeOperator) {
                            $qq->where('Familyname', $likeOperator, $like)
                                ->orWhere('Givenname', $likeOperator, $like)
                                ->orWhere('DocumentNo', $likeOperator, $like)
                                ->orWhereRaw('concat_ws(\' \', "Givenname", "Familyname") ILIKE ?', [$like])
                            ->orWhereRaw('concat_ws(\' \', "Familyname", "Givenname") ILIKE ?', [$like]);
                        });
                        }

                    });
                })
                ->paginate(10);
        }

    return response()->json($visits);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(CreateVisitsRequest $request)
    {
        $data = $request->validated();

        // Obtener el usuario autenticado
        $usuarioActual = Auth::user();

        $visit = Visit::create([
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


            'UrevUsuario' => 'Registrado - ' . ($usuarioActual ? $usuarioActual->name : 'Desconocido'),
            'UrevFechaHora' => Carbon::now(),
        ]);

        return response()->json($visit->load(['ciudad', 'sexes', 'maritalStatus']), 201);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Visit $visit)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Visit $visit)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
 public function update(UpdateVisitsRequest $request, $id)
    {
        $data = $request->validated();

        // Obtener el usuario autenticado
        $usuarioActual = Auth::user();

        $visit = Visit::findOrFail($id);

        $visit->update([
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


            'UrevUsuario' => 'Actualizado - ' . ($usuarioActual ? $usuarioActual->name : 'Desconocido'),
            'UrevFechaHora' => Carbon::now(),
        ]);

        return response()->json($visit->load(['ciudad', 'sexes', 'maritalStatus']), 200);
    }

    public function DeleteVisita($id)
    {
        $visit = Visit::findOrFail($id);
        $visit->delete();
        return response()->json(['message' => 'Visita eliminada correctamente.'], 200);
    }
}
