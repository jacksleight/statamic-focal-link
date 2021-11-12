<?php

namespace JackSleight\StatamicLinkFragmentFieldtype;

use Exception;
use Str;
use Statamic\Facades\Entry;

class Utilities
{   
    protected $presets;

    protected $links;

    public function __construct($presets, $links)
    {
        $this->presets = collect($presets);
        $this->links   = collect($links);
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

        $filter = function ($link, $pattern) use ($value) {
            if (Str::startsWith($pattern, 'https://')) {
                $pattern = 'http://' . Str::after($pattern, 'https://');
            }
            return Str::is($pattern, $value);
        };

        collect()
            ->merge($this->presets->filter($filter)->values())
            ->merge($this->links->filter($filter)->values())
            ->each(function ($link) use (&$spec) {
                if (!is_array($link)) {
                    return;
                }
                foreach ($link as $key => $list) {
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