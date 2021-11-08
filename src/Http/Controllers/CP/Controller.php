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
            $linkVariant,
            $linkId,
        ) = Utilities::parseLink($linkValue);

        $linkSpec = Utilities::getSpec($linkType, $linkVariant);

        if ($discover && $linkSpec && $linkSpec['discover'] !== false) {
            if ($linkSpec['fragments'] !== false) {
                $linkSpec['fragments'] = array_merge(
                    $linkSpec['fragments'],
                    Scanner::scan($linkType, $linkId, $linkSpec['discover'])
                );
            }
            $linkSpec['discovered'] = true;
        }

        return $linkSpec;
    }
}