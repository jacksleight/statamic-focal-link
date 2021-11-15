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

    'https://laravel.com/docs/*' => [
        'discovery' => [
            "//*[@id='main-content']//*[not(self::script)][@id]" => 'text()',
        ],
    ],

    'http://www.youtube.com/*' => [
        'fragments' => [
            't={{ 1m30s }}' => 'Timecode',
            't={{ 90 }}'    => 'Time in Seconds',
        ],
    ],

    'https://vimeo.com/*' => [
        'fragments' => [
            't={{ 1m30s }}' => 'Timecode',
        ],
    ],

];
