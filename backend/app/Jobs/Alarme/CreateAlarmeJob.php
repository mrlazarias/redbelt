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

class CreateAlarmeJob implements ShouldQueue
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
    public $queue = 'alarmes_create';

    /**
     * Os dados do alarme
     *
     * @var array
     */
    protected $data;

    /**
     * O ID do usuário que criou o alarme
     *
     * @var int
     */
    protected $userId;

    /**
     * Create a new job instance.
     */
    public function __construct(array $data, int $userId)
    {
        $this->data = $data;
        $this->userId = $userId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Se não tiver tipo_alarme_id mas tiver um novo tipo, criar o tipo
            if (empty($this->data['tipo_alarme_id']) && !empty($this->data['novo_tipo_alarme'])) {
                $tipoAlarme = TipoAlarme::firstOrCreate(['nome' => $this->data['novo_tipo_alarme']]);
                $this->data['tipo_alarme_id'] = $tipoAlarme->id;
            }

            // Remover campo não-mapeado
            unset($this->data['novo_tipo_alarme']);

            // Adicionar o ID do usuário
            $this->data['user_id'] = $this->userId;

            // Criar o alarme
            $alarme = Alarme::create($this->data);

            Log::info('Alarme criado com sucesso', ['id' => $alarme->id]);
        } catch (\Exception $e) {
            Log::error('Erro ao criar alarme', [
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
        Log::error('Falha ao processar job de criação de alarme', [
            'error' => $exception->getMessage(),
            'data' => $this->data
        ]);
    }
} 