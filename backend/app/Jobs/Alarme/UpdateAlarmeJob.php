<?php

namespace App\Jobs\Alarme;

use App\Models\Alarme;
use App\Models\TipoAlarme;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class UpdateAlarmeJob implements ShouldQueue
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
    public $queue = 'alarmes_update';

    /**
     * O ID do alarme a ser atualizado
     * 
     * @var int
     */
    protected $alarmeId;

    /**
     * Os dados para atualização
     *
     * @var array
     */
    protected $data;

    /**
     * Create a new job instance.
     */
    public function __construct(int $alarmeId, array $data)
    {
        $this->alarmeId = $alarmeId;
        $this->data = $data;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Buscar o alarme
            $alarme = Alarme::findOrFail($this->alarmeId);

            // Se informou um novo tipo de alarme
            if (!empty($this->data['novo_tipo_alarme'])) {
                $tipoAlarme = TipoAlarme::firstOrCreate(['nome' => $this->data['novo_tipo_alarme']]);
                $this->data['tipo_alarme_id'] = $tipoAlarme->id;
            }

            // Remover campo não-mapeado
            unset($this->data['novo_tipo_alarme']);

            // Atualizar o alarme
            $alarme->update($this->data);

            Log::info('Alarme atualizado com sucesso', ['id' => $alarme->id]);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar alarme', [
                'id' => $this->alarmeId,
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
        Log::error('Falha ao processar job de atualização de alarme', [
            'id' => $this->alarmeId,
            'error' => $exception->getMessage(),
            'data' => $this->data
        ]);
    }
} 