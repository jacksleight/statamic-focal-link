<?php

namespace JackSleight\StatamicFocalLink;

use Statamic\Providers\AddonServiceProvider;

class ServiceProvider extends AddonServiceProvider
{
    protected $routes = [
        'cp' => __DIR__.'/../routes/cp.php',
    ];

    protected $vite = [
        'hotFile' => __DIR__.'/../vite.hot',
        'publicDirectory' => 'dist',
        'input' => [
            'resources/js/addon.js',
        ],
    ];

    protected $fieldtypes = [
        \JackSleight\StatamicFocalLink\Fieldtypes\FocalLinkFieldtype::class,
    ];

    public function register()
    {
        parent::register();

        $this->mergeConfigFrom(
            __DIR__.'/../config/statamic/focal_link.php', 'statamic.focal_link',
        );

        $this->app->singleton(Utilities::class, function () {
            $presets = require_once __DIR__.'/../resources/data/presets.php';

            return new Utilities(config('statamic.focal_link.types'), $presets);
        });
        $this->app->singleton(Scanner::class, function () {
            return new Scanner();
        });
    }

    public function boot()
    {
        parent::boot();

        $this->publishes([
            __DIR__.'/../config/statamic/focal_link.php' => config_path('statamic/focal_link.php'),
        ], 'statamic-focal-link-config');
    }
}
