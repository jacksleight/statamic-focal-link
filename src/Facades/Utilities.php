<?php

namespace JackSleight\StatamicFocalLink\Facades;

use Illuminate\Support\Facades\Facade;

class Utilities extends Facade
{
    protected static function getFacadeAccessor()
    {
        return \JackSleight\StatamicFocalLink\Utilities::class;
    }
}