<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\Request;
use App\Http\Requests\StoreResourceRequest;
use App\Http\Requests\UpdateResourceRequest;

class ResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $search = $request->input('search');
         $searchNormalized = is_string($search) ? preg_replace('/\s+/', ' ', trim($search)) : null;
         $searchTerms = $searchNormalized ? preg_split('/\s+/', $searchNormalized, -1, PREG_SPLIT_NO_EMPTY) : [];
         $baseQuery = Resource::with(['doctor'])
            ->orderByDesc('id');

        if ($request->query('all')) {
            $resources = $baseQuery->get();
        } else {
            $resources = $baseQuery
                ->when(!empty($searchTerms), function ($query) use ($searchTerms) {
                    return $query->where(function ($q) use ($searchTerms) {
                        foreach ($searchTerms as $term) {
                            $like = '%' . $term . '%';
                            $q->where(function ($qq) use ($like) {
                                $qq->where('ResourceName', 'ilike', $like)
                                    ->orWhere('ResourceNumber', 'ilike', $like)
                                    ->orWhereHas('doctor', function ($dq) use ($like) {
                                        $dq->where('FirstName', 'ilike', $like)
                                            ->orWhere('LastName', 'ilike', $like)
                                            ->orWhereRaw("concat_ws(' ', \"FirstName\", \"LastName\") ILIKE ?", [$like])
                                            ->orWhereRaw("concat_ws(' ', \"LastName\", \"FirstName\") ILIKE ?", [$like]);
                                    });
                            });
                        }
                    });
                })
                ->paginate(10);
        }

    return response()->json($resources);
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
    public function store(StoreResourceRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Resource $resource)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Resource $resource)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateResourceRequest $request, Resource $resource)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Resource $resource)
    {
        //
    }
    public function DeleteConsultorio($id)
    {      
        //Busco el resource
        $resource = Resource::findOrFail($id);
        //Elimino el resource
        $resource->delete();
        //Retorno un mensaje de confirmación
        return response()->json(['message' => 'Resource eliminado correctamente.'],200);
    }
}
