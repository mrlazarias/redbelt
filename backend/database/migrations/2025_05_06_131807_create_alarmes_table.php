<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('alarmes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('tipo_alarme_id');
            $table->tinyInteger('criticidade')->comment('0=info, 1=baixo, 2=médio, 3=alto, 4=crítico');
            $table->tinyInteger('status')->comment('0=fechado, 1=aberto, 2=em andamento');
            $table->tinyInteger('ativo')->default(1)->comment('0=desativado, 1=ativo');
            $table->dateTime('data_ocorrencia');
            $table->string('tipo');
            $table->softDeletes();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('tipo_alarme_id')->references('id')->on('tipo_alarmes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alarmes');
    }
};
