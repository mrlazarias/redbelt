<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_reset_password_link_can_be_requested(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $this->post('/forgot-password', ['email' => $user->email]);

        Notification::assertSentTo($user, ResetPassword::class);
    }

    public function test_reset_password_link_returns_error_with_invalid_email(): void
    {
        $response = $this->post('/forgot-password', ['email' => 'nonexistent@example.com']);

        $response->assertSessionHasErrors(['email']);
    }

    public function test_reset_password_notification_can_be_sent(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        // Usa o facade de redefinição de senha diretamente
        Password::sendResetLink(['email' => $user->email]);

        Notification::assertSentTo($user, ResetPassword::class);
    }

    public function test_password_can_be_reset(): void
    {
        $user = User::factory()->create();
        $this->assertNotNull($user);
        
        // Gerar token diretamente
        $token = Password::createToken($user);
        $this->assertNotNull($token);
        
        // Simular redefinição de senha
        $status = Password::reset(
            [
                'email' => $user->email,
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
                'token' => $token,
            ], 
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->save();
            }
        );
        
        $this->assertEquals(Password::PASSWORD_RESET, $status);
    }

    public function test_password_reset_fails_with_invalid_token(): void
    {
        $user = User::factory()->create();
        
        // Simular redefinição de senha com token inválido
        $status = Password::reset(
            [
                'email' => $user->email,
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
                'token' => 'invalid-token',
            ], 
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->save();
            }
        );
        
        $this->assertEquals(Password::INVALID_TOKEN, $status);
    }

    public function test_password_reset_requires_valid_email(): void
    {
        // Simular redefinição de senha com email inválido
        $status = Password::sendResetLink(['email' => 'nonexistent@example.com']);
        
        $this->assertEquals(Password::INVALID_USER, $status);
    }
}
