<?php

namespace App\Http\Controllers;

use App\Models\People;
use Illuminate\Http\Request;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use Illuminate\Support\Facades\DB;

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

        $baseQuery = People::with(['ciudad'])
            ->when($idTypePeople, function ($query, $idTypePeople) {
                return $query->where('Id_Type_People', $idTypePeople);
            });

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

    public function DeletePaciente($id)
    {      
        //Busco el paciente
        $paciente = People::findOrFail($id);
        //Elimino el paciente
        $paciente->delete();
        //Retorno un mensaje de confirmación
        return response()->json(['message' => 'Paciente eliminado correctamente.'],200);
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
    public function store(StorePatientRequest $request)
    {
        //
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
    public function update(UpdatePatientRequest $request, People $people)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(People $people)
    {
        //
    }
}
