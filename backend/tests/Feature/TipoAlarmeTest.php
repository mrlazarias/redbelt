<?php

namespace Tests\Feature;

use App\Models\TipoAlarme;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TipoAlarmeTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
    }

    /** @test */
    public function usuarios_autenticados_podem_listar_tipos_de_alarme()
    {
        $this->actingAs($this->user);
        
        TipoAlarme::factory()->count(3)->create();
        
        $response = $this->getJson('/api/tipo-alarmes');
        
        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    /** @test */
    public function usuarios_nao_autenticados_nao_podem_listar_tipos_de_alarme()
    {
        TipoAlarme::factory()->count(3)->create();
        
        $response = $this->getJson('/api/tipo-alarmes');
        
        $response->assertStatus(401);
    }

    /** @test */
    public function usuarios_autenticados_podem_criar_tipos_de_alarme()
    {
        $this->actingAs($this->user);
        
        $tipoData = [
            'nome' => 'Novo Tipo de Alarme'
        ];
        
        $response = $this->postJson('/api/tipo-alarmes', $tipoData);
        
        $response->assertStatus(201)
                 ->assertJsonFragment(['nome' => 'Novo Tipo de Alarme']);
                 
        $this->assertDatabaseHas('tipo_alarmes', ['nome' => 'Novo Tipo de Alarme']);
    }

    /** @test */
    public function usuarios_nao_autenticados_nao_podem_criar_tipos_de_alarme()
    {
        $tipoData = [
            'nome' => 'Novo Tipo de Alarme'
        ];
        
        $response = $this->postJson('/api/tipo-alarmes', $tipoData);
        
        $response->assertStatus(401);
    }

    /** @test */
    public function o_nome_do_tipo_de_alarme_deve_ser_unico()
    {
        $this->actingAs($this->user);
        
        TipoAlarme::factory()->create(['nome' => 'Tipo Existente']);
        
        $tipoData = [
            'nome' => 'Tipo Existente'
        ];
        
        $response = $this->postJson('/api/tipo-alarmes', $tipoData);
        
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['nome']);
    }

    /** @test */
    public function usuarios_autenticados_podem_atualizar_tipos_de_alarme()
    {
        $this->actingAs($this->user);
        
        $tipo = TipoAlarme::factory()->create(['nome' => 'Tipo Inicial']);
        
        $response = $this->putJson("/api/tipo-alarmes/{$tipo->id}", [
            'nome' => 'Tipo Atualizado'
        ]);
        
        $response->assertStatus(200)
                 ->assertJsonFragment(['nome' => 'Tipo Atualizado']);
                 
        $this->assertDatabaseHas('tipo_alarmes', [
            'id' => $tipo->id,
            'nome' => 'Tipo Atualizado'
        ]);
    }

    /** @test */
    public function usuarios_autenticados_podem_ver_um_tipo_de_alarme()
    {
        $this->actingAs($this->user);
        
        $tipo = TipoAlarme::factory()->create();
        
        $response = $this->getJson("/api/tipo-alarmes/{$tipo->id}");
        
        $response->assertStatus(200)
                 ->assertJsonFragment(['id' => $tipo->id]);
    }

    /** @test */
    public function usuarios_autenticados_podem_deletar_tipos_de_alarme()
    {
        $this->actingAs($this->user);
        
        $tipo = TipoAlarme::factory()->create();
        
        $response = $this->deleteJson("/api/tipo-alarmes/{$tipo->id}");
        
        $response->assertStatus(204);
        
        $this->assertDatabaseMissing('tipo_alarmes', ['id' => $tipo->id]);
    }
} 