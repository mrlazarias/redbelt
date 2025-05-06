<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\AlarmeController;
use App\Http\Controllers\TipoAlarmeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rotas de autenticação
Route::post('login', [AuthenticatedSessionController::class, 'store']);
Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth:sanctum');

Route::middleware(['auth:sanctum'])->get('user', function (Request $request) {
    return $request->user();
});

// Rotas protegidas
Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('alarmes', AlarmeController::class);
    Route::apiResource('tipo-alarmes', TipoAlarmeController::class)->only(['index', 'store']);
});
        