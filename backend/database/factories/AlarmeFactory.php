<?php

namespace Database\Factories;

use App\Models\TipoAlarme;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Alarme>
 */
class AlarmeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'tipo_alarme_id' => TipoAlarme::factory(),
            'criticidade' => fake()->randomElement(['baixa', 'media', 'alta']),
            'status' => fake()->randomElement([1, 2, 3]),
            'ativo' => fake()->boolean(),
            'data_ocorrencia' => fake()->dateTimeBetween('-1 month', 'now'),
            'tipo' => fake()->sentence(3),
            'deleted_by' => null
        ];
    }
} 