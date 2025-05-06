<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoAlarme extends Model
{
    use HasFactory;

    protected $fillable = ['nome'];
    
    public function alarmes()
    {
        return $this->hasMany(Alarme::class);
    }
}
