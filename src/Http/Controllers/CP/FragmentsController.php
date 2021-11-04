<?php

namespace JackSleight\StatamicLinkFragmentFieldtype\Http\Controllers\CP;

use Illuminate\Http\Request;
use Statamic\Http\Controllers\CP\CpController;
use JackSleight\StatamicLinkFragmentFieldtype\Facades\Scanner;

class FragmentsController extends CpController
{
    public function index(Request $request)
    {
        return Scanner::scan($request->link);
    }
}