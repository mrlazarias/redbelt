<?php

namespace Tests\Unit;

use App\Models\Alarme;
use App\Models\TipoAlarme;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TipoAlarmeTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function um_tipo_alarme_pode_ter_muitos_alarmes()
    {
        $tipoAlarme = TipoAlarme::factory()->create();
        Alarme::factory()->count(3)->create(['tipo_alarme_id' => $tipoAlarme->id]);

        $this->assertInstanceOf('Illuminate\Database\Eloquent\Collection', $tipoAlarme->alarmes);
        $this->assertCount(3, $tipoAlarme->alarmes);
        $this->assertInstanceOf(Alarme::class, $tipoAlarme->alarmes->first());
    }

    /** @test */
    public function pode_ser_criado_com_factory()
    {
        $tipoAlarme = TipoAlarme::factory()->create(['nome' => 'Tipo de Teste']);
        
        $this->assertInstanceOf(TipoAlarme::class, $tipoAlarme);
        $this->assertEquals('Tipo de Teste', $tipoAlarme->nome);
        $this->assertDatabaseHas('tipo_alarmes', ['nome' => 'Tipo de Teste']);
    }
} 