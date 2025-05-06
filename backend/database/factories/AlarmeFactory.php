<?php

namespace Database\Factories;

use App\Models\Alarme;
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
            'criticidade' => fake()->randomElement([
                Alarme::CRITICIDADE_INFO,
                Alarme::CRITICIDADE_BAIXO, 
                Alarme::CRITICIDADE_MEDIO, 
                Alarme::CRITICIDADE_ALTO,
                Alarme::CRITICIDADE_CRITICO
            ]),
            'status' => fake()->randomElement([
                Alarme::STATUS_ABERTO,
                Alarme::STATUS_EM_ANDAMENTO,
                Alarme::STATUS_FECHADO
            ]),
            'ativo' => Alarme::ATIVO_ATIVO,
            'data_ocorrencia' => fake()->dateTimeBetween('-1 month', 'now'),
            'tipo' => fake()->sentence(3),
            'deleted_by' => null
        ];
    }
} 