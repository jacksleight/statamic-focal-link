<?php

/**
 * These examples are not included by default, but you can copy them
 * into your config if you want to use them. Bear in mind that site
 * design changes may invalidate these XPath expressions.
 */

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

];
