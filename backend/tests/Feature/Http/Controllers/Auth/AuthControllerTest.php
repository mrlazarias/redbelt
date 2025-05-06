<?php

namespace Tests\Feature\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_password_controller_reset(): void
    {
        $user = User::factory()->create();
        $token = Password::createToken($user);

        Event::fake();

        $response = $this->post('/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => 'new-password',
            'password_confirmation' => 'new-password'
        ]);

        Event::assertDispatched(PasswordReset::class);
    }

    public function test_registered_user_controller_store(): void
    {
        Event::fake();

        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password'
        ]);

        Event::assertDispatched(Registered::class);
        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }

    public function test_verify_email_controller_verify(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => null
        ]);

        Event::fake();

        $verifyUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        $response = $this->actingAs($user)->get($verifyUrl);

        Event::assertDispatched(Verified::class);
    }

    public function test_email_verification_notification_controller_store(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => null
        ]);

        $response = $this->actingAs($user)
                         ->post('/email/verification-notification');

        $response->assertSessionHasNoErrors();
    }
} 