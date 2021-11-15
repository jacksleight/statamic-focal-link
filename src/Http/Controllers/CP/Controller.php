<?php

namespace JackSleight\StatamicFocalLink\Http\Controllers\CP;

use Illuminate\Http\Request;
use JackSleight\StatamicFocalLink\Facades\Scanner;
use JackSleight\StatamicFocalLink\Facades\Utilities;
use Statamic\Http\Controllers\CP\CpController;

class Controller extends CpController
{
    public function spec(Request $request)
    {
        $value = $request->value;
        $discover = $request->discover === 'true';

        $link = Utilities::parseLink($value, true);
        $spec = Utilities::getSpec($link);

        if ($discover && $spec) {
            $spec = Scanner::scan($link, $spec);
        }

        return $spec;
    }
}
