<?php

namespace Tests\Unit;

use App\Models\Alarme;
use App\Models\TipoAlarme;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AlarmeTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function um_alarme_pertence_a_um_usuario()
    {
        $user = User::factory()->create();
        $alarme = Alarme::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $alarme->user);
        $this->assertEquals($user->id, $alarme->user->id);
    }

    /** @test */
    public function um_alarme_pertence_a_um_tipo_de_alarme()
    {
        $tipoAlarme = TipoAlarme::factory()->create();
        $alarme = Alarme::factory()->create(['tipo_alarme_id' => $tipoAlarme->id]);

        $this->assertInstanceOf(TipoAlarme::class, $alarme->tipoAlarme);
        $this->assertEquals($tipoAlarme->id, $alarme->tipoAlarme->id);
    }

    /** @test */
    public function um_alarme_pode_ser_soft_deleted()
    {
        $alarme = Alarme::factory()->create(['status' => 1]);
        
        $alarme->delete();
        
        $this->assertSoftDeleted('alarmes', ['id' => $alarme->id]);
    }
} 