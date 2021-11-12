<?php

return [

    'links' => [

        // Entry Links
    
        'entry::*' => [
            'fragments' => [
                ":~:text={{ text }}" => "Text Fragment",
            ],
        ],
    
        // URL Links
    
        'http://*' => [
            'fragments' => [
                ":~:text={{ text }}" => "Text Fragment",
            ],
        ],
    
        'http://github.com/*' => [
            'discovery' => [
                "//a[starts-with(@id, 'user-content-')]/@href" => "following-sibling::text()",
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
    
    ],

];