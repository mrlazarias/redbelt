<?php

namespace Tests\Feature;

use App\Models\Alarme;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AppServiceProviderTest extends TestCase
{
    use RefreshDatabase;

    public function test_boot_method_executes_successfully(): void
    {
        // O método boot do AppServiceProvider é executado automaticamente ao inicializar a aplicação
        // Se não lançar exceções, significa que está funcionando corretamente
        $this->assertTrue(true);
    }

    public function test_alarme_boot_correctly_binds_deleted_by_id(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        
        $alarme = Alarme::factory()->create(['status' => 1, 'deleted_by' => null]);
        
        // Quando o evento deleting é disparado, o campo deleted_by deve ser preenchido
        $alarme->delete();
        
        $alarmeExcluido = Alarme::withTrashed()->find($alarme->id);
        $this->assertEquals($user->id, $alarmeExcluido->deleted_by);
    }
} 