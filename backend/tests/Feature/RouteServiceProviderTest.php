<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class RouteServiceProviderTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_constant_is_defined(): void
    {
        $this->assertTrue(defined('App\Providers\RouteServiceProvider::HOME'));
    }

    public function test_api_routes_are_loaded(): void
    {
        // Verifica se as rotas da API estão carregadas corretamente
        $this->assertTrue(Route::has('alarmes.index'));
        $this->assertTrue(Route::has('tipo-alarmes.index'));
    }

    public function test_web_routes_are_loaded(): void
    {
        // Verifica se a rota principal está carregada
        $response = $this->get('/');
        $response->assertStatus(200);
        
        // Verifica se as rotas de autenticação estão carregadas
        $this->assertTrue(Route::has('login'));
    }
} 