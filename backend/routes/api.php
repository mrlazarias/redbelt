<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AlarmeController;
use App\Http\Controllers\TipoAlarmeController;

// Rotas protegidas por autenticação
Route::middleware('auth:sanctum')->group(function () {
    // CRUD de alarmes
    Route::apiResource('alarmes', AlarmeController::class);

    // CRUD parcial de tipos de alarme (listar e criar)
    Route::apiResource('tipo-alarmes', TipoAlarmeController::class)->only(['index', 'store']);
});