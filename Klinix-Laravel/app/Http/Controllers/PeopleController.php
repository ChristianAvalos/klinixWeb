<?php

namespace App\Http\Controllers;

use App\Models\People;
use Illuminate\Http\Request;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;

class PeopleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        if ($request->query('all')) {
            $pacientes = People::with(['ciudad'])->get();
        } else {
            $pacientes = People::with(['ciudad'])
                    ->when($search, function ($query, $search) {
                    return $query->where(function ($q) use ($search) {
                        $q->where('LastName', 'ilike', '%' . $search . '%')
                            ->orWhere('FirstName', 'ilike', '%' . $search . '%')
                            ->orWhere('DocumentNo', 'ilike', '%' . $search . '%');
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
