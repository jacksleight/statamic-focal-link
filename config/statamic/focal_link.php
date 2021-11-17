<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Link Types
    |--------------------------------------------------------------------------
    */

    'types' => [

        'entry::*' => [
            'discovery' => [
                '//*[@id]' => 'text()',                   // Use text content for labels
                // '//*[@id]' => '@title',                // Use title attribute for labels
                // "//*[@id='content']//*[@id]" => '...', // Only search within #content element
            ],
            'fragments' => [
                ':~:text={{ text }}' => 'Text Fragment',
            ],
            // 'queries' => [],                           // Uncomment to enable query field
        ],

    ],

];
