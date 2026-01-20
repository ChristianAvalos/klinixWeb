<?php

namespace App\Http\Controllers;

use App\Models\Sexes;
use Illuminate\Http\Request;

class SexesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sexes = Sexes::all();
        return response()->json($sexes);
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Sexes $sexes)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sexes $sexes)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sexes $sexes)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sexes $sexes)
    {
        //
    }
}
