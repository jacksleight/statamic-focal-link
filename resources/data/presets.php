<?php

/**
 * These template presets are included by default.
 */

return [

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
