<?php

namespace JackSleight\StatamicLinkFragmentFieldtype;

use Arr;

class SpecRepository
{
    protected $default = [
        'entries' => [
            'pages' => [
                'fragments' => [
                    'templates' => [
                        ':~:text=' => 'Text',
                    ],
                ],
            ],
        ],
        'urls' => [
            'statamic.dev' => [
                'queries' => [
                    'templates' => [
                        '?holly=' => 'Holly',
                    ],
                ],
                'fragments' => [
                    'discover' => true,
                    'within' => '#content',
                    'except' => [
                        '#table-of-contents'
                    ],
                    'options' => [
                        'potato' => 'Potato',
                    ],
                    'templates' => [
                        ':~:text=' => 'Text Fragment',
                    ],
                ],
            ],
        ],
    ];
    
    protected $data = [

    ];

    public function __construct($data)
    {
        $this->data = $this->merge($data, $this->default);
    }

    public function get($type, $name)
    {
        $value = $this->data[$type][$name] + [
            'queries'   => [],
            'fragments' => [],
        ];
        $value['queries'] += [
            'options'   => [],
            'templates' => [],
        ];
        $value['fragments'] += [
            'options'   => [],
            'templates' => [],
        ];
        return $value;
    }

    protected function merge()
    {
        $merged = [];
        $arrays = func_get_args();
        foreach ($arrays as $array) {
            foreach ($array as $key => $value) {
                if (is_array($value) && isset($merged[$key])) {
                    if (!Arr::isAssoc($merged[$key]) && !Arr::isAssoc($value)) {
                        $merged[$key] = array_merge($merged[$key], $value);
                    } else {
                        $merged[$key] = $this->merge($merged[$key], $value);
                    }
                } else {
                    $merged[$key] = $value;
                }                
            }
        }
        return $merged;
    }
}