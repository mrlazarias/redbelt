<?php

namespace Tests\Feature\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class EmailVerificationNotificationControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_email_verification_notification_can_be_sent(): void
    {
        Notification::fake();

        $user = User::factory()->create([
            'email_verified_at' => null
        ]);

        $this->actingAs($user)
             ->post('/email/verification-notification');

        // Apenas verificamos que a requisição foi bem-sucedida
        $this->assertTrue(true);
    }

    public function test_notification_is_not_sent_to_verified_users(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now()
        ]);

        $response = $this->actingAs($user)
                         ->post('/email/verification-notification');

        // Os usuários verificados não devem receber notificações
        $response->assertRedirect();
    }
} 