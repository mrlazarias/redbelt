<?php

namespace App\Http\Controllers;

use App\Http\Controllers\AlarmeController;
use App\Jobs\TipoAlarme\CreateTipoAlarmeJob;
use App\Jobs\TipoAlarme\UpdateTipoAlarmeJob;
use App\Jobs\TipoAlarme\DeleteTipoAlarmeJob;
use App\Models\TipoAlarme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;

class TipoAlarmeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Cache::remember('tipo_alarmes:all', 300, function () {
            return response()->json(TipoAlarme::all());
        });
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nome' => 'required|string|unique:tipo_alarmes'
        ]);

        // Criar um modelo temporário para preview
        $preview = new TipoAlarme($data);
        
        // Disparar o job para processamento em background
        CreateTipoAlarmeJob::dispatch($data);
        
        // Invalidar cache após criar novo tipo de alarme
        $this->invalidateTipoAlarmeCache();

        return response()->json([
            'message' => 'Tipo de alarme enviado para processamento',
            'tipo_alarme' => $preview,
            'job_dispatched' => true
        ], 202);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Cache::remember('tipo_alarme:' . $id, 300, function () use ($id) {
            $tipoAlarme = TipoAlarme::findOrFail($id);
            return response()->json($tipoAlarme);
        });
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $tipoAlarme = TipoAlarme::findOrFail($id);
        
        $data = $request->validate([
            'nome' => 'required|string|unique:tipo_alarmes,nome,' . $id,
        ]);
        
        // Criar uma prévia para feedback imediato
        $preview = $tipoAlarme->toArray();
        foreach ($data as $key => $value) {
            $preview[$key] = $value;
        }
        
        // Disparar o job para processamento em background
        UpdateTipoAlarmeJob::dispatch($tipoAlarme->id, $data);
        
        // Invalidar cache após atualizar tipo de alarme
        $this->invalidateTipoAlarmeCache($id);

        return response()->json([
            'message' => 'Atualização de tipo de alarme enviada para processamento',
            'tipo_alarme' => $preview,
            'job_dispatched' => true
        ], 202);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $tipoAlarme = TipoAlarme::findOrFail($id);
        
        // Disparar o job para processamento em background
        DeleteTipoAlarmeJob::dispatch($tipoAlarme->id);
        
        // Invalidar cache após excluir tipo de alarme
        $this->invalidateTipoAlarmeCache($id);
        
        return response()->json([
            'message' => 'Solicitação de exclusão enviada para processamento',
            'job_dispatched' => true
        ], 202);
    }
    
    /**
     * Invalidar cache relacionado a tipos de alarme
     */
    protected function invalidateTipoAlarmeCache($tipoAlarmeId = null)
    {
        // Limpar lista completa
        Cache::forget('tipo_alarmes:all');
        
        // Se informado um tipo de alarme específico, remove seu cache individual
        if ($tipoAlarmeId) {
            Cache::forget('tipo_alarme:' . $tipoAlarmeId);
        }
        
        // Invalidar também os caches de alarmes, já que podem depender dos tipos
        app(AlarmeController::class)->invalidateAlarmeCache();
    }
}
