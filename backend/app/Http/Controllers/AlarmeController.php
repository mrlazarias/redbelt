<?php

namespace App\Http\Controllers;

use App\Models\Alarme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AlarmeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Alarme::with(['user', 'tipoAlarme']);

        // Filtros
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('criticidade')) {
            $query->where('criticidade', $request->criticidade);
        }
        if ($request->has('ativo')) {
            $query->where('ativo', $request->ativo);
        }

        // Ordenação
        if ($request->has('order_by')) {
            $query->orderBy($request->order_by, $request->get('order_dir', 'asc'));
        }

        // Paginação
        return $query->paginate($request->get('per_page', 10));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'tipo_alarme_id' => 'required|exists:tipo_alarmes,id',
            'criticidade' => 'required|in:baixa,media,alta',
            'status' => 'required|integer',
            'ativo' => 'boolean',
            'data_ocorrencia' => 'required|date',
            'tipo' => 'required|string'
        ]);

        $data['user_id'] = Auth::id();
        $alarme = Alarme::create($data);

        return response()->json($alarme, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Alarme $alarme)
    {
        return response()->json($alarme->load(['user', 'tipoAlarme']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Alarme $alarme)
    {
        // Validação de imutabilidade da data
        if ($request->has('data_ocorrencia') && 
            $request->data_ocorrencia != $alarme->data_ocorrencia) {
            return response()->json([
                'error' => 'Data de ocorrência não pode ser alterada'
            ], 422);
        }

        $data = $request->validate([
            'tipo_alarme_id' => 'exists:tipo_alarmes,id',
            'criticidade' => 'in:baixa,media,alta',
            'status' => 'integer',
            'ativo' => 'boolean',
            'tipo' => 'string'
        ]);

        $alarme->update($data);
        return response()->json($alarme);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Alarme $alarme)
    {
        if ($alarme->status != 1) {
            return response()->json([
                'error' => 'Só é possível deletar alarmes com status 1'
            ], 403);
        }

        $alarme->deleted_by = Auth::id();
        $alarme->save();
        $alarme->delete();

        return response()->json(null, 204);
    }
}
