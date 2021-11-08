<?php

namespace JackSleight\StatamicLinkFragmentFieldtype\Facades;

use Illuminate\Support\Facades\Facade;

class Utilities extends Facade
{
    protected static function getFacadeAccessor()
    {
        return \JackSleight\StatamicLinkFragmentFieldtype\Utilities::class;
    }
}