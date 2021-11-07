<?php

namespace JackSleight\StatamicLinkFragmentFieldtype\Facades;

use Illuminate\Support\Facades\Facade;

class Spec extends Facade
{
    protected static function getFacadeAccessor()
    {
        return \JackSleight\StatamicLinkFragmentFieldtype\SpecRepository::class;
    }
}