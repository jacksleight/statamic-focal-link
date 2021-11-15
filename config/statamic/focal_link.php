<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Links
    |--------------------------------------------------------------------------
    */

    'links' => [

        'entry::*' => [
            'queries' => [],
            'fragments' => [
                ':~:text={{ text }}' => 'Text Fragment',
            ],
        ],

        'entry::pages/*' => [
            'discovery' => [
                '//*[@id]' => 'text()',
            ],
        ],

    ],

];
