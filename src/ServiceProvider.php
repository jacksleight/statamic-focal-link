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

    }

    public function boot()
    {
        parent::boot();

        
    }
}
