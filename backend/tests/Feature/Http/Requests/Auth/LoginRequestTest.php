<?php

namespace Tests\Feature\Http\Requests\Auth;

use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class LoginRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_validation_rules_exist(): void
    {
        $request = new LoginRequest();
        $rules = $request->rules();
        
        $this->assertArrayHasKey('email', $rules);
        $this->assertArrayHasKey('password', $rules);
        $this->assertEquals(['required', 'string', 'email'], $rules['email']);
        $this->assertEquals(['required', 'string'], $rules['password']);
    }

    public function test_login_request_prepareForValidation(): void
    {
        $request = new LoginRequest();
        $this->assertTrue(method_exists($request, 'prepareForValidation'));
    }

    public function test_login_request_ensureIsNotRateLimited(): void
    {
        $request = new LoginRequest();
        $this->assertTrue(method_exists($request, 'ensureIsNotRateLimited'));
    }

    public function test_login_request_authenticate_method(): void
    {
        $request = new LoginRequest();
        $this->assertTrue(method_exists($request, 'authenticate'));
    }

    public function test_login_functional_test(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('password')
        ]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password'
        ]);

        $response->assertStatus(200);
        $this->assertAuthenticated();
    }
} 