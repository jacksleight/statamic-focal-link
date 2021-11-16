<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Link Types
    |--------------------------------------------------------------------------
    */

    'types' => [

        '*' => [
            'queries' => [],
            'fragments' => [],
        ],

        'entry::*' => [
            'queries' => [],
            'fragments' => [
                ':~:text={{ text }}' => 'Text Fragment',
            ],
            'discovery' => [
                '//*[@id]' => 'text()',
                // '//*[@id]' => '@title',
                // '//*[@id]' => '@data-label',
            ],
        ],

    ],

];
