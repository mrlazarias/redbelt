<?php

namespace App\Providers;

use App\Models\Alarme;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });

        // Registrar o evento de deleted_by ao excluir um Alarme
        Alarme::deleting(function ($alarme) {
            if (Auth::check()) {
                $alarme->deleted_by = Auth::id();
                $alarme->save();
            }
        });
    }
}
