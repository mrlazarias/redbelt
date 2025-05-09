<?php

namespace App\Jobs\TipoAlarme;

use App\Models\TipoAlarme;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class UpdateTipoAlarmeJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Número de tentativas do job
     *
     * @var int
     */
    public $tries = 3;

    /**
     * A fila em que o job será colocado
     *
     * @var string
     */
    public $queue = 'tipos_alarme_update';

    /**
     * O ID do tipo de alarme a ser atualizado
     * 
     * @var int
     */
    protected $tipoAlarmeId;

    /**
     * Os dados para atualização
     *
     * @var array
     */
    protected $data;

    /**
     * Create a new job instance.
     */
    public function __construct(int $tipoAlarmeId, array $data)
    {
        $this->tipoAlarmeId = $tipoAlarmeId;
        $this->data = $data;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Buscar o tipo de alarme
            $tipoAlarme = TipoAlarme::findOrFail($this->tipoAlarmeId);

            // Atualizar o tipo de alarme
            $tipoAlarme->update($this->data);

            Log::info('Tipo de alarme atualizado com sucesso', ['id' => $tipoAlarme->id]);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar tipo de alarme', [
                'id' => $this->tipoAlarmeId,
                'error' => $e->getMessage(),
                'data' => $this->data
            ]);
            
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Falha ao processar job de atualização de tipo de alarme', [
            'id' => $this->tipoAlarmeId,
            'error' => $exception->getMessage(),
            'data' => $this->data
        ]);
    }
} 