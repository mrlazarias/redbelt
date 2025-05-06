<?php

namespace Database\Seeders;

use App\Models\TipoAlarme;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TipoAlarmeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TipoAlarme::create(['nome' => 'Incêndio']);
        TipoAlarme::create(['nome' => 'Roubo']);
        TipoAlarme::create(['nome' => 'Pane Elétrica']);
        TipoAlarme::create(['nome' => 'Falha de Sistema']);
        TipoAlarme::create(['nome' => 'Intrusão']);
    }
}
