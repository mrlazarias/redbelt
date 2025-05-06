<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Alarme extends Model
{
    use HasFactory, SoftDeletes;

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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tipoAlarme()
    {
        return $this->belongsTo(TipoAlarme::class);
    }
}
