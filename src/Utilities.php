<?php

namespace JackSleight\StatamicLinkFragmentFieldtype;

use Exception;
use Str;
use Statamic\Facades\Entry;

class Utilities
{   
    protected $presets;

    protected $classes;

    public function __construct($presets, $classes)
    {
        $this->presets = collect($presets);
        $this->classes = collect($classes);
    }

    public function getSpec($value)
    {
        if (!isset($value)) {
            return;
        }

        $spec = [
            'queries'    => false,
            'fragments'  => false,
            'discovery'  => false,
            'discovered' => false,
        ];

        $filter = function ($data, $format) use ($value) {
            if (Str::startsWith($format, 'https://')) {
                $format = 'http://' . Str::after($format, 'https://');
            }
            return Str::is($format, $value);
        };

        collect()
            ->merge($this->presets->filter($filter)->values())
            ->merge($this->classes->filter($filter)->values())
            ->each(function ($data) use (&$spec) {
                if (!is_array($data)) {
                    return;
                }
                foreach ($data as $key => $list) {
                    if (!isset($spec[$key])) {
                        return;
                    }
                    if (is_array($spec[$key]) && is_array($list)) {
                        $spec[$key] = array_merge($spec[$key], $list);
                    } else {
                        $spec[$key] = $list;
                    }
                }
            });

        return $spec;
    }

    public function parseValue($value)
    {
        $linkValue     = null;
        $queryValue    = null;
        $fragmentValue = null;

        if (isset($value)) {

            $url = parse_url($value);
            
            if (isset($url['query'])) {
                $linkValue = Str::before($value, '?');
            } else if (isset($url['fragment'])) {
                $linkValue = Str::before($value, '#');
            } else {
                $linkValue = $value;
            }
            $queryValue    = $url['query'] ?? null;
            $fragmentValue = $url['fragment'] ?? null;
            
        }
        
        return [
            $linkValue,
            $queryValue,
            $fragmentValue,
        ];
    }

    public function parseLink($link)
    {
        $linkType  = null;
        $linkClass = null;
        $linkRaw   = null;

        if (isset($link)) {

            if (Str::startsWith($link, 'entry::')) {
                $id    = Str::after($link, 'entry::');
                $entry = Entry::find($id);
                if ($entry && $entry->url()) {
                    $linkType  = 'entry';
                    $linkClass = 'entry::' . $entry->collection()->handle() . '/' . $entry->blueprint()->handle();
                    $linkRaw   = $id;
                }
            } else if ($link !== '@child') {
                $linkType  = 'url';
                $linkClass = $link;
                $linkRaw   = $link;
                if (Str::startsWith($linkClass, 'https://')) {
                    $linkClass = 'http://' . Str::after($linkClass, 'https://');
                }
            }
            
        }
        
        return [
            $linkType,
            $linkClass,
            $linkRaw,
        ];
    }
    
}