<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PaisController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\CiudadController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\PeopleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\OrganizacionController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout',[AuthController::class,'logout']);
    Route::get('/usuarios',[AuthController::class,'index']);
    Route::get('/usuarios/permisos', [AuthController::class, 'ObtenerPermisosUsuario']);
    Route::post('/crearusuarios',[AuthController::class,'createUser']);
    Route::delete('/usuario/{id}', [AuthController::class, 'DeleteUser']);
    Route::put('/usuarioUpdate/{id}', [AuthController::class, 'updateUser'])->name('usuario.update');
    Route::post('/cambiarpassword', [AuthController::class, 'cambiarpassword']);
    Route::post('/usuario/{id}/reset-password', [AuthController::class, 'resetPassword']);
    Route::post('/usuario_estado/{id}', [AuthController::class, 'estadoUser']);

    //Organizacion 
    Route::get('/organizacion',[OrganizacionController::class,'index']);
    Route::delete('/organizacion/{id}', [OrganizacionController::class, 'DeleteOrganizacion']);
    Route::post('/crear_organizacion',[OrganizacionController::class,'createOrganizacion']);
    Route::put('/update_organizacion/{id}',[OrganizacionController::class,'updateOrganizacion']);

    //Roles
    Route::get('/roles',[RoleController::class,'index']);
    Route::delete('/roles/{id}', [RoleController::class, 'DeleteRol']);
    Route::post('/crearrol',[RoleController::class,'createRol']);
    Route::put('/rolUpdate/{id}', [RoleController::class, 'updateRol'])->name('rol.update');
    
    //Permisos a los roles
    Route::get('roles/{roleId}/permisos', [PermissionController::class, 'ObtenerPermisosRole']);
    Route::post('roles/{roleId}/permisos', [PermissionController::class, 'ActualizarPermisos']);

    //Reporte de usuarios
    Route::POST('/reporte/usuarios/descarga', [ReportController::class, 'downloadUserReport']);
    Route::GET('/reporte/usuarios', [ReportController::class, 'generateUserReport']);

    //Paises 
    Route::get('/paises',[PaisController::class,'index']);

    //Ciudades
    Route::get('/ciudades',[CiudadController::class,'index']);

    //Doctores
    Route::get('/doctores',[DoctorController::class,'index']);
    Route::post('/creardoctores',[DoctorController::class,'create']);
    Route::put('/editardoctores/{id}',[DoctorController::class,'update']);
    Route::delete('/doctores/{id}', [DoctorController::class, 'DeleteDoctor']);

    //pacientes
    Route::get('/personas',[PeopleController::class,'index']);
    Route::post('/crearpersonas',[PeopleController::class,'create']);
    Route::put('/editarpersonas/{id}',[PeopleController::class,'update']);
    Route::delete('/persona/{id}', [PeopleController::class, 'DeletePersona']);

});


//Logueo e inicio de sesion 
Route::post('/registro',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);













