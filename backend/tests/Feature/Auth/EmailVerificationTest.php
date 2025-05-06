<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class EmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_email_verification_components_exist(): void
    {
        // Verificar se a classe de verificação de email existe
        $this->assertTrue(class_exists('Illuminate\Auth\Events\Verified'));
    }

    public function test_user_can_have_verified_email(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $this->assertTrue($user->hasVerifiedEmail());
    }

    public function test_email_is_not_verified_for_new_users(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => null,
        ]);

        $this->assertFalse($user->hasVerifiedEmail());
    }

    public function test_user_email_can_be_manually_verified(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => null,
        ]);
        
        // Verifica se o email não está verificado inicialmente
        $this->assertFalse($user->hasVerifiedEmail());
        
        // Verifica manualmente
        $user->markEmailAsVerified();
        
        // Verifica se o email está verificado agora
        $this->assertTrue($user->fresh()->hasVerifiedEmail());
    }
}
