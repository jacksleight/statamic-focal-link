<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Link Classes
    |--------------------------------------------------------------------------
    */

    'classes' => [

        'entry::pages/*' => [
            'discovery' => [
                "//*[@id]" => "text()",
            ],
        ],

    ],

];