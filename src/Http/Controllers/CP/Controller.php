<?php

namespace JackSleight\StatamicLinkFragmentFieldtype\Http\Controllers\CP;

use Str;
use Illuminate\Http\Request;
use Statamic\Http\Controllers\CP\CpController;
use JackSleight\StatamicLinkFragmentFieldtype\Facades\Scanner;
use JackSleight\StatamicLinkFragmentFieldtype\Facades\Spec;
use Statamic\Facades\Entry;

class Controller extends CpController
{
    public function spec(Request $request)
    {
        $link = $request->link;

        if (Str::startsWith($link, 'entry::')) {
            $id   = Str::after($link, 'entry::');
            $type = 'entries';
            $name = Entry::find($id)->collection()->handle();
        } else if (Str::startsWith($link, 'http://') || Str::startsWith($link, 'https://')) {
            $type = 'urls';
            $name = parse_url($link)['host'];
        }

        return Spec::get($type, $name);
    }

    public function discover(Request $request)
    {
        return Scanner::scan($request->link);
    }
}