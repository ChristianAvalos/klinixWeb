<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Doctor;
use App\Models\Resource;
use App\Models\Patient;
use App\Models\Visit;
use App\Models\Role;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function contadores()
    {
        return response()->json([
            'usuarios' => User::count(),
            'doctores' => Doctor::count(),
            'consultorios' => Resource::count(),
            'pacientes' => Patient::count(),
            'visitas' => Visit::count(),
            'roles' => Role::count(),
        ]);
    }
}
