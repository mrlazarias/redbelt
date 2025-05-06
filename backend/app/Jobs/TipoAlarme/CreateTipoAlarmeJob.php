<?php

namespace App\Jobs\TipoAlarme;

use App\Models\TipoAlarme;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class CreateTipoAlarmeJob implements ShouldQueue
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
    public $queue = 'tipos_alarme_create';

    /**
     * Os dados do tipo de alarme
     *
     * @var array
     */
    protected $data;

    /**
     * Create a new job instance.
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Criar o tipo de alarme
            $tipoAlarme = TipoAlarme::create($this->data);

            Log::info('Tipo de alarme criado com sucesso', ['id' => $tipoAlarme->id]);
        } catch (\Exception $e) {
            Log::error('Erro ao criar tipo de alarme', [
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
        Log::error('Falha ao processar job de criação de tipo de alarme', [
            'error' => $exception->getMessage(),
            'data' => $this->data
        ]);
    }
} 