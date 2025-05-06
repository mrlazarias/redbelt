<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EnsureEmailIsVerifiedTest extends TestCase
{
    use RefreshDatabase;

    public function test_middleware_exists(): void
    {
        // Verificar se a classe de middleware existe
        $this->assertTrue(class_exists(\Illuminate\Auth\Middleware\EnsureEmailIsVerified::class));
    }

    public function test_verified_attribute_exists_on_user(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);
        
        // Verificar se o atributo email_verified_at existe no modelo User
        $this->assertNotNull($user->email_verified_at);
    }
} 