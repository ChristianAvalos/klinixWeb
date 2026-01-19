<?php

namespace App\Http\Controllers;

use App\Models\TypePeople;
use Illuminate\Http\Request;

class TypePeopleController extends Controller
{
    public function index()
    {
        $typePeople = TypePeople::all();
        return response()->json($typePeople);
    }
}
