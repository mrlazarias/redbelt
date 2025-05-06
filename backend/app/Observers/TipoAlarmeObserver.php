<?php

namespace App\Observers;

use App\Http\Controllers\TipoAlarmeController;
use App\Models\TipoAlarme;
use Illuminate\Support\Facades\Cache;

class TipoAlarmeObserver
{
    /**
     * Handle the TipoAlarme "created" event.
     */
    public function created(TipoAlarme $tipoAlarme): void
    {
        $this->clearCache();
    }

    /**
     * Handle the TipoAlarme "updated" event.
     */
    public function updated(TipoAlarme $tipoAlarme): void
    {
        $this->clearCache($tipoAlarme->id);
    }

    /**
     * Handle the TipoAlarme "deleted" event.
     */
    public function deleted(TipoAlarme $tipoAlarme): void
    {
        $this->clearCache($tipoAlarme->id);
    }

    /**
     * Handle the TipoAlarme "restored" event.
     */
    public function restored(TipoAlarme $tipoAlarme): void
    {
        $this->clearCache($tipoAlarme->id);
    }

    /**
     * Handle the TipoAlarme "force deleted" event.
     */
    public function forceDeleted(TipoAlarme $tipoAlarme): void
    {
        $this->clearCache($tipoAlarme->id);
    }
    
    /**
     * Limpar o cache relacionado a tipos de alarme
     */
    private function clearCache($tipoAlarmeId = null)
    {
        app(TipoAlarmeController::class)->invalidateTipoAlarmeCache($tipoAlarmeId);
    }
} 