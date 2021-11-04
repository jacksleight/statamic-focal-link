<?php

namespace JackSleight\StatamicLinkFragmentFieldtype\Facades;

use Illuminate\Support\Facades\Facade;

class Scanner extends Facade
{
    protected static function getFacadeAccessor()
    {
        return \JackSleight\StatamicLinkFragmentFieldtype\Scanner::class;
    }
}