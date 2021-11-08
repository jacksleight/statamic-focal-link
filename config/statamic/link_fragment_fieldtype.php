<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Link Variants
    |--------------------------------------------------------------------------
    |
    | Configuration for different link variants.
    |
    */

    // Entry Links

    'entry:*' => [
        'queries' => false,
        'fragments' => [
            ':~:text=?&potato' => 'Text Fragment',
        ],
        'discover' => [
            'labels' => [
                'content' => true,
            ],
        ],
    ],

    // URL Links

    'url:*' => [
        'fragments' => [
            ':~:text={{}}' => 'Text Fragment',
        ],
    ],

];