<?php

namespace App\Http\Controllers;

use App\Jobs\Alarme\CreateAlarmeJob;
use App\Jobs\Alarme\UpdateAlarmeJob;
use App\Jobs\Alarme\DeleteAlarmeJob;
use App\Models\Alarme;
use App\Models\TipoAlarme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use Illuminate\Validation\Rule;

class AlarmeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Criar uma chave de cache única baseada nos parâmetros da requisição
        $cacheKey = 'alarmes:' . md5(json_encode($request->all()));
        
        // Verificar se os dados já estão em cache
        if (Redis::exists($cacheKey)) {
            return Cache::get($cacheKey);
        }
        
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
        $results = $query->paginate($request->get('per_page', 10));
        
        // Armazenar em cache por 5 minutos
        Cache::put($cacheKey, $results, 300);
        
        return $results;
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

        // Se o alarme deve ser criado imediatamente para exibição ao usuário
        if (empty($data['tipo_alarme_id']) && !empty($data['novo_tipo_alarme'])) {
            $tipoAlarme = TipoAlarme::firstOrCreate(['nome' => $data['novo_tipo_alarme']]);
            $data['tipo_alarme_id'] = $tipoAlarme->id;
        }

        // Preparar dados para visualização imediata
        $preview = $data;
        $preview['user_id'] = Auth::id();
        
        // Disparar o job para processamento em background
        CreateAlarmeJob::dispatch($data, Auth::id());
        
        // Invalidar o cache após adicionar novo alarme
        $this->invalidateAlarmeCache();

        // Retornar uma prévia do alarme para feedback imediato
        $alarme = new Alarme($preview);
        return response()->json([
            'message' => 'Alarme enviado para processamento',
            'alarme' => $alarme,
            'job_dispatched' => true
        ], 202);
    }

    /**
     * Display the specified resource.
     */
    public function show(Alarme $alarme)
    {
        $cacheKey = 'alarme:' . $alarme->id;
        
        return Cache::remember($cacheKey, 300, function () use ($alarme) {
            return response()->json($alarme->load(['user', 'tipoAlarme']));
        });
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

        // Para feedback imediato, preparar uma prévia das mudanças
        $preview = $alarme->toArray();
        foreach ($data as $key => $value) {
            if ($key !== 'novo_tipo_alarme') {
                $preview[$key] = $value;
            }
        }

        // Se informou um novo tipo de alarme, criar para feedback imediato
        if (!empty($data['novo_tipo_alarme'])) {
            $tipoAlarme = TipoAlarme::firstOrCreate(['nome' => $data['novo_tipo_alarme']]);
            $preview['tipo_alarme_id'] = $tipoAlarme->id;
        }

        // Disparar o job para processamento em background
        UpdateAlarmeJob::dispatch($alarme->id, $data);
        
        // Invalidar caches relacionados
        $this->invalidateAlarmeCache($alarme->id);

        return response()->json([
            'message' => 'Atualização de alarme enviada para processamento',
            'alarme' => $preview,
            'job_dispatched' => true
        ], 202);
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

        // Disparar o job para processamento em background
        DeleteAlarmeJob::dispatch($alarme->id, Auth::id());
        
        // Invalidar caches relacionados
        $this->invalidateAlarmeCache($alarme->id);

        return response()->json([
            'message' => 'Solicitação de exclusão enviada para processamento',
            'job_dispatched' => true
        ], 202);
    }

    /**
     * Get statistics about alarmes.
     */
    public function stats()
    {
        return Cache::remember('alarmes:stats', 300, function () {
            $totalAlarmes = Alarme::count();
            $alarmesAtivos = Alarme::where('ativo', Alarme::ATIVO_ATIVO)->count();
            $alarmesResolvidos = Alarme::where('status', Alarme::STATUS_FECHADO)->count();
            
            return response()->json([
                'totalAlarmes' => $totalAlarmes,
                'alarmesAtivos' => $alarmesAtivos,
                'alarmesResolvidos' => $alarmesResolvidos
            ]);
        });
    }
    
    /**
     * Invalidar cache relacionado a alarmes
     */
    protected function invalidateAlarmeCache($alarmeId = null)
    {
        // Limpar estatísticas
        Cache::forget('alarmes:stats');
        
        // Se informado um alarme específico, remove seu cache individual
        if ($alarmeId) {
            Cache::forget('alarme:' . $alarmeId);
        }
        
        // Remove todos os caches de listagem (usando pattern)
        $keys = Redis::keys('alarmes:*');
        if (!empty($keys)) {
            Redis::del(...$keys);
        }
    }
}
