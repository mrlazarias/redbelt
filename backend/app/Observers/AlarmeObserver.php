<?php

namespace App\Observers;

use App\Http\Controllers\AlarmeController;
use App\Models\Alarme;
use Illuminate\Support\Facades\Cache;

class AlarmeObserver
{
    /**
     * Handle the Alarme "created" event.
     */
    public function created(Alarme $alarme): void
    {
        $this->clearCache();
    }

    /**
     * Handle the Alarme "updated" event.
     */
    public function updated(Alarme $alarme): void
    {
        $this->clearCache($alarme->id);
    }

    /**
     * Handle the Alarme "deleted" event.
     */
    public function deleted(Alarme $alarme): void
    {
        $this->clearCache($alarme->id);
    }

    /**
     * Handle the Alarme "restored" event.
     */
    public function restored(Alarme $alarme): void
    {
        $this->clearCache($alarme->id);
    }

    /**
     * Handle the Alarme "force deleted" event.
     */
    public function forceDeleted(Alarme $alarme): void
    {
        $this->clearCache($alarme->id);
    }
    
    /**
     * Limpar o cache relacionado a alarmes
     */
    private function clearCache($alarmeId = null)
    {
        app(AlarmeController::class)->invalidateAlarmeCache($alarmeId);
    }
} 