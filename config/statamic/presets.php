<?php

return [

    'http:github.com' => [
        'queries'  => false,
        'discover' => [
            'regex'  => ['/^user-content-(.*)$/' => '$1'],
            'labels' => [
                'content' => true,
                'parent'  => true,
            ],
        ],
    ],

    'http:www.youtube.com' => [
        'queries'   => false,
        'fragments' => [
            't=?' => 'Start Time in Seconds',
        ],
    ],


    'http:statamic.dev' => [
        'queries'  => false,
        'discover' => [
            'within' => '#content',
            'except' => [
                'table-of-contents'
            ],
            'labels' => [
                'content' => true,
            ],
        ],
    ],

];