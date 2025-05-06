<?php

namespace App\Console\Commands;

use App\Models\Alarme;
use App\Models\TipoAlarme;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CreateTestAlarmsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-test-alarms {count=20}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Criar alarmes de teste para o sistema';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = $this->argument('count');
        $this->info("Criando {$count} alarmes de teste...");

        $tipoAlarmes = TipoAlarme::all();
        if ($tipoAlarmes->isEmpty()) {
            $this->error('Não existem tipos de alarmes cadastrados.');
            return Command::FAILURE;
        }

        $users = User::all();
        if ($users->isEmpty()) {
            $this->error('Não existem usuários cadastrados.');
            return Command::FAILURE;
        }

        $criticidades = ['baixa', 'media', 'alta'];
        $statusOptions = [1, 2, 3];
        
        DB::beginTransaction();
        
        try {
            for ($i = 0; $i < $count; $i++) {
                $user = $users->random();
                $tipoAlarme = $tipoAlarmes->random();
                $criticidade = $criticidades[array_rand($criticidades)];
                $status = $statusOptions[array_rand($statusOptions)];
                $ativo = rand(0, 1) === 1;
                
                // Data entre 3 meses atrás e hoje
                $dataOcorrencia = Carbon::now()->subDays(rand(0, 90))->format('Y-m-d H:i:s');
                
                Alarme::create([
                    'user_id' => $user->id,
                    'tipo_alarme_id' => $tipoAlarme->id,
                    'criticidade' => $criticidade,
                    'status' => $status,
                    'ativo' => $ativo,
                    'data_ocorrencia' => $dataOcorrencia,
                    'tipo' => "Alarme de teste ".($i+1),
                ]);
                
                $this->output->write('.');
            }
            
            DB::commit();
            $this->newLine();
            $this->info("Foram criados {$count} alarmes com sucesso!");
            return Command::SUCCESS;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Erro ao criar alarmes: " . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
