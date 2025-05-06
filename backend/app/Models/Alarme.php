<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Alarme extends Model
{
    use HasFactory, SoftDeletes;

    // Constantes de criticidade
    const CRITICIDADE_INFO = 0;
    const CRITICIDADE_BAIXO = 1;
    const CRITICIDADE_MEDIO = 2;
    const CRITICIDADE_ALTO = 3;
    const CRITICIDADE_CRITICO = 4;

    // Constantes de status
    const STATUS_FECHADO = 0;
    const STATUS_ABERTO = 1;
    const STATUS_EM_ANDAMENTO = 2;

    // Constantes de ativo
    const ATIVO_DESATIVADO = 0;
    const ATIVO_ATIVO = 1;

    protected $fillable = [
        'user_id',
        'tipo_alarme_id',
        'criticidade',
        'status',
        'ativo',
        'data_ocorrencia',
        'tipo',
        'deleted_by'
    ];

    // Garantir que datas importantes não sejam alteradas
    protected static function booted()
    {
        static::updating(function ($alarme) {
            // data_ocorrencia é imutável
            if ($alarme->isDirty('data_ocorrencia')) {
                $alarme->data_ocorrencia = $alarme->getOriginal('data_ocorrencia');
            }

            // created_at é imutável
            if ($alarme->isDirty('created_at')) {
                $alarme->created_at = $alarme->getOriginal('created_at');
            }
        });
    }

    // Soft delete só é permitido se status == 1 (aberto)
    public function canSoftDelete(): bool
    {
        return $this->status === self::STATUS_ABERTO;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tipoAlarme()
    {
        return $this->belongsTo(TipoAlarme::class);
    }
}
