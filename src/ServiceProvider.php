<?php

namespace JackSleight\StatamicLinkFragmentFieldtype;

use Statamic\Providers\AddonServiceProvider;

class ServiceProvider extends AddonServiceProvider
{
    protected $routes = [
        'cp'  => __DIR__.'/../routes/cp.php',
    ];

    protected $scripts = [
        __DIR__ . '/../dist/js/addon.js',
    ];

    protected $fieldtypes = [
        \JackSleight\StatamicLinkFragmentFieldtype\Fieldtypes\LinkFragment::class,
    ];

    public function register()
    {
        parent::register();

        $this->mergeConfigFrom(
            __DIR__ . '/../config/statamic/link-fragment-fieldtype.php', 'statamic.link-fragment-fieldtype',
        );
    }

    public function boot()
    {
        parent::boot();

        $this->publishes([
            __DIR__ . '/../config/statamic/link-fragment-fieldtype.php' => config_path('statamic/link-fragment-fieldtype.php'),
        ], 'statamic-link-fragment-fieldtype-config');
    }
}
