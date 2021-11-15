<?php

return [

    'http://github.com/*' => [
        'discovery' => [
            "//a[starts-with(@id, 'user-content-')]/@href" => 'following-sibling::text()',
        ],
    ],

    'http://statamic.dev/*' => [
        'discovery' => [
            "//*[@id='content']//*[@id]" => 'text()',
        ],
    ],

    'http://laravel.com/*' => [
        'discovery' => [
            "//*[@id='main-content']//*[@id]" => 'text()',
        ],
    ],

    'http://youtube.com/*' => [
        'fragments' => [
            't={{ 1m30s }}' => 'Timecode',
            't={{ 90 }}'    => 'Time in Seconds',
        ],
    ],

    'http://vimeo.com/*' => [
        'fragments' => [
            't={{ 1m30s }}' => 'Timecode',
        ],
    ],

];
