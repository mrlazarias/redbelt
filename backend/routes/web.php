<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return response()->json([
        'Laravel Version' => app()->version(),
    ]);
});

// Rota para testar o middleware de verificação de email
Route::middleware(['auth', 'verified'])->get('/verified-route', function () {
    return response()->json(['message' => 'Email verificado']);
});

// Rotas de autenticação
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth');

require __DIR__.'/auth.php';
