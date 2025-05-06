<?php

namespace App\Http\Controllers;

use App\Models\Alarme;
use App\Models\TipoAlarme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

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
        if ($request->has('tipo_alarme_id')) {
            $query->where('tipo_alarme_id', $request->tipo_alarme_id);
        }
        if ($request->has('search')) {
            $query->where('tipo', 'like', '%' . $request->search . '%');
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
            'tipo_alarme_id' => 'nullable|exists:tipo_alarmes,id',
            'criticidade' => [
                'required',
                Rule::in([
                    Alarme::CRITICIDADE_INFO,
                    Alarme::CRITICIDADE_BAIXO,
                    Alarme::CRITICIDADE_MEDIO,
                    Alarme::CRITICIDADE_ALTO,
                    Alarme::CRITICIDADE_CRITICO
                ])
            ],
            'status' => [
                'required',
                Rule::in([
                    Alarme::STATUS_FECHADO,
                    Alarme::STATUS_ABERTO,
                    Alarme::STATUS_EM_ANDAMENTO
                ])
            ],
            'ativo' => [
                'required',
                Rule::in([
                    Alarme::ATIVO_DESATIVADO,
                    Alarme::ATIVO_ATIVO
                ])
            ],
            'data_ocorrencia' => 'required|date',
            'tipo' => 'required|string',
            'novo_tipo_alarme' => 'nullable|string|required_without:tipo_alarme_id'
        ]);

        // Se não tiver tipo_alarme_id mas tiver um novo tipo, criar o tipo
        if (empty($data['tipo_alarme_id']) && !empty($data['novo_tipo_alarme'])) {
            $tipoAlarme = TipoAlarme::firstOrCreate(['nome' => $data['novo_tipo_alarme']]);
            $data['tipo_alarme_id'] = $tipoAlarme->id;
        }

        // Remover campo não-mapeado
        unset($data['novo_tipo_alarme']);

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
        // O model já garante imutabilidade de data_ocorrencia e created_at
        $data = $request->validate([
            'tipo_alarme_id' => 'nullable|exists:tipo_alarmes,id',
            'criticidade' => [
                'nullable',
                Rule::in([
                    Alarme::CRITICIDADE_INFO,
                    Alarme::CRITICIDADE_BAIXO,
                    Alarme::CRITICIDADE_MEDIO,
                    Alarme::CRITICIDADE_ALTO,
                    Alarme::CRITICIDADE_CRITICO
                ])
            ],
            'status' => [
                'nullable',
                Rule::in([
                    Alarme::STATUS_FECHADO,
                    Alarme::STATUS_ABERTO,
                    Alarme::STATUS_EM_ANDAMENTO
                ])
            ],
            'ativo' => [
                'nullable',
                Rule::in([
                    Alarme::ATIVO_DESATIVADO,
                    Alarme::ATIVO_ATIVO
                ])
            ],
            'tipo' => 'nullable|string',
            'novo_tipo_alarme' => 'nullable|string'
        ]);

        // Se informou um novo tipo de alarme
        if (!empty($data['novo_tipo_alarme'])) {
            $tipoAlarme = TipoAlarme::firstOrCreate(['nome' => $data['novo_tipo_alarme']]);
            $data['tipo_alarme_id'] = $tipoAlarme->id;
        }

        // Remover campo não-mapeado
        unset($data['novo_tipo_alarme']);

        $alarme->update($data);
        return response()->json($alarme);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Alarme $alarme)
    {
        if (!$alarme->canSoftDelete()) {
            return response()->json([
                'error' => 'Só é possível deletar alarmes com status 1 (aberto)'
            ], 403);
        }

        // Aplicar regras de soft-delete
        $alarme->ativo = Alarme::ATIVO_DESATIVADO;
        $alarme->deleted_by = Auth::id();
        $alarme->save();
        $alarme->delete();

        return response()->json(null, 204);
    }

    /**
     * Get statistics about alarmes.
     */
    public function stats()
    {
        $totalAlarmes = Alarme::count();
        $alarmesAtivos = Alarme::where('ativo', Alarme::ATIVO_ATIVO)->count();
        $alarmesResolvidos = Alarme::where('status', Alarme::STATUS_FECHADO)->count();
        
        return response()->json([
            'totalAlarmes' => $totalAlarmes,
            'alarmesAtivos' => $alarmesAtivos,
            'alarmesResolvidos' => $alarmesResolvidos
        ]);
    }
}
