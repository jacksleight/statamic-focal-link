<?php

namespace JackSleight\StatamicLinkFragmentFieldtype;

use Statamic\Providers\AddonServiceProvider;
use JackSleight\StatamicLinkFragmentFieldtype\Scanner;
use JackSleight\StatamicLinkFragmentFieldtype\Utilities;

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
            __DIR__ . '/../config/statamic/link_fragment_fieldtype.php', 'statamic.link_fragment_fieldtype',
        );

        $this->app->singleton(Utilities::class, function () {
            $presets = require_once __DIR__.'/../data/presets.php';
            $classes = config('statamic.link_fragment_fieldtype.classes');
            return new Utilities($presets, $classes);
        });
        $this->app->singleton(Scanner::class, function () {
            return new Scanner();
        });
    }

    public function boot()
    {
        parent::boot();

        $this->publishes([
            __DIR__ . '/../config/statamic/link_fragment_fieldtype.php' => config_path('statamic/link_fragment_fieldtype.php'),
        ], 'statamic-link-fragment-fieldtype-config');
    }
}
