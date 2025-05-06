<?php

namespace Tests\Feature\Http\Middleware;

use App\Models\User;
use Illuminate\Auth\Middleware\EnsureEmailIsVerified;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class EnsureEmailIsVerifiedMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    /** @var EnsureEmailIsVerified */
    protected $middleware;

    /** @var User */
    protected $user;

    public function setUp(): void
    {
        parent::setUp();
        $this->middleware = new EnsureEmailIsVerified();
        $this->user = User::factory()->create([
            'email_verified_at' => null,
        ]);
    }

    public function test_middleware_exists(): void
    {
        $this->assertInstanceOf(EnsureEmailIsVerified::class, $this->middleware);
    }

    public function test_middleware_implementation(): void
    {
        $this->assertTrue(method_exists($this->middleware, 'handle'));
    }

    public function test_user_authentication_check(): void
    {
        $this->assertFalse($this->user->hasVerifiedEmail());
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);
        $this->assertTrue($user->hasVerifiedEmail());
    }
} 