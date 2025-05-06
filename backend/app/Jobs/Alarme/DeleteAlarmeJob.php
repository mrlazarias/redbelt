<?php

namespace App\Jobs\Alarme;

use App\Models\Alarme;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class DeleteAlarmeJob implements ShouldQueue
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
    public $queue = 'alarmes_delete';

    /**
     * O ID do alarme a ser excluído
     * 
     * @var int
     */
    protected $alarmeId;

    /**
     * O ID do usuário que está excluindo o alarme
     * 
     * @var int
     */
    protected $userId;

    /**
     * Create a new job instance.
     */
    public function __construct(int $alarmeId, int $userId)
    {
        $this->alarmeId = $alarmeId;
        $this->userId = $userId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Buscar o alarme
            $alarme = Alarme::findOrFail($this->alarmeId);

            // Verificar se o alarme pode ser excluído
            if (!$alarme->canSoftDelete()) {
                throw new \Exception('Só é possível deletar alarmes com status 1 (aberto)');
            }

            // Aplicar regras de soft-delete
            $alarme->ativo = Alarme::ATIVO_DESATIVADO;
            $alarme->deleted_by = $this->userId;
            $alarme->save();
            $alarme->delete();

            Log::info('Alarme excluído com sucesso', ['id' => $this->alarmeId]);
        } catch (\Exception $e) {
            Log::error('Erro ao excluir alarme', [
                'id' => $this->alarmeId,
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
        Log::error('Falha ao processar job de exclusão de alarme', [
            'id' => $this->alarmeId,
            'error' => $exception->getMessage()
        ]);
    }
} 