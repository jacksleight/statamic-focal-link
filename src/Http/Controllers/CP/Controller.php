<?php

namespace JackSleight\StatamicLinkFragmentFieldtype\Http\Controllers\CP;

use Str;
use Illuminate\Http\Request;
use Statamic\Http\Controllers\CP\CpController;
use JackSleight\StatamicLinkFragmentFieldtype\Facades\Utilities;
use JackSleight\StatamicLinkFragmentFieldtype\Facades\Scanner;

class Controller extends CpController
{
    public function spec(Request $request)
    {
        $value    = $request->value;
        $discover = $request->discover === 'true';

        list(
            $linkValue
        ) = Utilities::parseValue($value);

        list(
            $linkType,
            $linkClass,
            $linkRaw,
        ) = Utilities::parseLink($linkValue);

        $linkSpec = Utilities::getSpec($linkClass);

        if ($discover && $linkSpec) {
            $linkSpec = Scanner::scan($linkType, $linkRaw, $linkSpec);
        }

        return $linkSpec;
    }
}