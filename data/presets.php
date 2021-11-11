<?php

return [

    // Entry Link Classes

    'entry::*' => [
        'fragments' => [
            ":~:text={{ text }}" => "Text Fragment",
        ],
    ],

    // URL Link Classes

    'http://*' => [
        'fragments' => [
            ":~:text={{ text }}" => "Text Fragment",
        ],
    ],

    'http://github.com/*' => [
        'discovery' => [
            "//*[starts-with(@id, 'user-content-')]" => "following-sibling::text()",
        ],
    ],

    'http://www.youtube.com/watch' => [
        'fragments' => [
            "t={{ seconds }}" => "Start Time",
        ],
    ],

    'http://statamic.dev/*' => [
        'discovery' => [
            "//*[@id='content']//*[@id]" => "text()",
        ],
    ],

];