<?php

namespace Tests\Feature;

use App\Models\Alarme;
use App\Models\TipoAlarme;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AlarmeTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $user;
    protected TipoAlarme $tipoAlarme;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->tipoAlarme = TipoAlarme::factory()->create(['nome' => 'Alarme de Teste']);
    }

    /** @test */
    public function usuarios_autenticados_podem_listar_alarmes()
    {
        $this->actingAs($this->user);
        
        Alarme::factory()->count(5)->create([
            'user_id' => $this->user->id,
            'tipo_alarme_id' => $this->tipoAlarme->id
        ]);
        
        $response = $this->getJson('/api/alarmes');
        
        $response->assertStatus(200)
                 ->assertJsonCount(5, 'data');
    }

    /** @test */
    public function usuarios_autenticados_podem_criar_alarmes()
    {
        $this->actingAs($this->user);
        
        $alarmeData = [
            'tipo_alarme_id' => $this->tipoAlarme->id,
            'criticidade' => 'alta',
            'status' => 1,
            'ativo' => true,
            'data_ocorrencia' => now()->format('Y-m-d H:i:s'),
            'tipo' => 'Alarme de Teste'
        ];
        
        $response = $this->postJson('/api/alarmes', $alarmeData);
        
        $response->assertStatus(201)
                 ->assertJsonFragment(['criticidade' => 'alta']);
                 
        $this->assertDatabaseHas('alarmes', [
            'user_id' => $this->user->id,
            'tipo_alarme_id' => $this->tipoAlarme->id,
            'criticidade' => 'alta'
        ]);
    }

    /** @test */
    public function usuarios_autenticados_podem_ver_um_alarme()
    {
        $this->actingAs($this->user);
        
        $alarme = Alarme::factory()->create([
            'user_id' => $this->user->id,
            'tipo_alarme_id' => $this->tipoAlarme->id
        ]);
        
        $response = $this->getJson("/api/alarmes/{$alarme->id}");
        
        $response->assertStatus(200)
                 ->assertJsonFragment(['id' => $alarme->id]);
    }

    /** @test */
    public function usuarios_autenticados_podem_atualizar_alarmes()
    {
        $this->actingAs($this->user);
        
        $alarme = Alarme::factory()->create([
            'user_id' => $this->user->id,
            'tipo_alarme_id' => $this->tipoAlarme->id,
            'criticidade' => 'baixa'
        ]);
        
        $response = $this->putJson("/api/alarmes/{$alarme->id}", [
            'criticidade' => 'alta'
        ]);
        
        $response->assertStatus(200)
                 ->assertJsonFragment(['criticidade' => 'alta']);
                 
        $this->assertDatabaseHas('alarmes', [
            'id' => $alarme->id,
            'criticidade' => 'alta'
        ]);
    }

    /** @test */
    public function data_de_ocorrencia_nao_pode_ser_alterada()
    {
        $this->actingAs($this->user);
        
        $dataOriginal = now()->format('Y-m-d H:i:s');
        $alarme = Alarme::factory()->create([
            'user_id' => $this->user->id,
            'tipo_alarme_id' => $this->tipoAlarme->id,
            'data_ocorrencia' => $dataOriginal
        ]);
        
        $response = $this->putJson("/api/alarmes/{$alarme->id}", [
            'data_ocorrencia' => now()->addDay()->format('Y-m-d H:i:s')
        ]);
        
        $response->assertStatus(422)
                 ->assertJson(['error' => 'Data de ocorrência não pode ser alterada']);
                 
        $this->assertDatabaseHas('alarmes', [
            'id' => $alarme->id,
            'data_ocorrencia' => $dataOriginal
        ]);
    }

    /** @test */
    public function apenas_alarmes_com_status_1_podem_ser_deletados()
    {
        $this->actingAs($this->user);
        
        // Alarme com status 1 - deve poder ser excluído
        $alarmeComStatus1 = Alarme::factory()->create([
            'user_id' => $this->user->id,
            'tipo_alarme_id' => $this->tipoAlarme->id,
            'status' => 1
        ]);
        
        $response = $this->deleteJson("/api/alarmes/{$alarmeComStatus1->id}");
        $response->assertStatus(204);
        $this->assertSoftDeleted('alarmes', ['id' => $alarmeComStatus1->id]);
        
        // Alarme com status 2 - NÃO deve poder ser excluído
        $alarmeComStatus2 = Alarme::factory()->create([
            'user_id' => $this->user->id,
            'tipo_alarme_id' => $this->tipoAlarme->id,
            'status' => 2
        ]);
        
        $response = $this->deleteJson("/api/alarmes/{$alarmeComStatus2->id}");
        $response->assertStatus(403);
        $this->assertDatabaseHas('alarmes', [
            'id' => $alarmeComStatus2->id,
            'deleted_at' => null
        ]);
    }

    /** @test */
    public function o_deleted_by_e_preenchido_ao_deletar_um_alarme()
    {
        $this->actingAs($this->user);
        
        $alarme = Alarme::factory()->create([
            'user_id' => $this->user->id,
            'tipo_alarme_id' => $this->tipoAlarme->id,
            'status' => 1
        ]);
        
        $this->deleteJson("/api/alarmes/{$alarme->id}");
        
        // Como o soft delete já ocorreu, precisamos usar withTrashed para encontrar o registro
        $alarmeExcluido = Alarme::withTrashed()->find($alarme->id);
        
        $this->assertEquals($this->user->id, $alarmeExcluido->deleted_by);
    }

    /** @test */
    public function usuarios_podem_filtrar_alarmes_por_status()
    {
        $this->actingAs($this->user);
        
        // Criar 3 alarmes com status 1
        Alarme::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'tipo_alarme_id' => $this->tipoAlarme->id,
            'status' => 1
        ]);
        
        // Criar 2 alarmes com status 2
        Alarme::factory()->count(2)->create([
            'user_id' => $this->user->id,
            'tipo_alarme_id' => $this->tipoAlarme->id,
            'status' => 2
        ]);
        
        // Filtrar por status 1
        $response = $this->getJson('/api/alarmes?status=1');
        
        $response->assertStatus(200)
                 ->assertJsonCount(3, 'data');
                 
        // Filtrar por status 2
        $response = $this->getJson('/api/alarmes?status=2');
        
        $response->assertStatus(200)
                 ->assertJsonCount(2, 'data');
    }
} 