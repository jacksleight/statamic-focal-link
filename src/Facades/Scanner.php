<?php

namespace JackSleight\StatamicFocalLink\Facades;

use Illuminate\Support\Facades\Facade;

class Scanner extends Facade
{
    protected static function getFacadeAccessor()
    {
        return \JackSleight\StatamicFocalLink\Scanner::class;
    }
}