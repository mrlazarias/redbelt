<?php

namespace App\Jobs\TipoAlarme;

use App\Models\TipoAlarme;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class DeleteTipoAlarmeJob implements ShouldQueue
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
    public $queue = 'tipos_alarme_delete';

    /**
     * O ID do tipo de alarme a ser excluído
     * 
     * @var int
     */
    protected $tipoAlarmeId;

    /**
     * Create a new job instance.
     */
    public function __construct(int $tipoAlarmeId)
    {
        $this->tipoAlarmeId = $tipoAlarmeId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Buscar o tipo de alarme
            $tipoAlarme = TipoAlarme::findOrFail($this->tipoAlarmeId);

            // Deletar o tipo de alarme
            $tipoAlarme->delete();

            Log::info('Tipo de alarme excluído com sucesso', ['id' => $this->tipoAlarmeId]);
        } catch (\Exception $e) {
            Log::error('Erro ao excluir tipo de alarme', [
                'id' => $this->tipoAlarmeId,
                'error' => $e->getMessage()
            ]);
            
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Falha ao processar job de exclusão de tipo de alarme', [
            'id' => $this->tipoAlarmeId,
            'error' => $exception->getMessage()
        ]);
    }
} 