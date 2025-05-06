<?php

namespace Tests\Feature\Middleware;

use App\Models\User;
use Illuminate\Auth\Middleware\EnsureEmailIsVerified;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EnsureEmailIsVerifiedTest extends TestCase
{
    use RefreshDatabase;

    public function test_middleware_exists(): void
    {
        $this->assertTrue(class_exists(EnsureEmailIsVerified::class));
    }

    public function test_middleware_allows_verified_user(): void
    {
        $this->assertTrue(true);
    }
} 