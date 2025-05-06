<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_be_created(): void
    {
        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password')
        ];
        
        $user = User::create($userData);
        
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com'
        ]);
        
        $this->assertInstanceOf(User::class, $user);
    }

    public function test_user_email_must_be_unique(): void
    {
        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password')
        ]);
        
        // Expectativa: Uma exceção deve ser lançada ao tentar criar um usuário com o mesmo e-mail
        $this->expectException(\Illuminate\Database\QueryException::class);
        
        User::create([
            'name' => 'Another User',
            'email' => 'test@example.com',
            'password' => Hash::make('password')
        ]);
    }

    public function test_user_can_be_authenticated(): void
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password')
        ]);
        
        $this->assertInstanceOf(User::class, $user);
        
        // Testar login programaticamente
        $credentials = [
            'email' => 'test@example.com',
            'password' => 'password'
        ];
        
        $this->assertTrue(auth()->attempt($credentials));
    }
}
