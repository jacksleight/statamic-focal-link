<?php

namespace JackSleight\StatamicFocalLink;

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

    public function getSpec($link)
    {
        if (!isset($link)) {
            return;
        }

        $spec = [
            'queries'    => null,
            'fragments'  => null,
            'discovery'  => null,
            'discovered' => false,
        ];

        $filter = function ($config, $pattern) use ($link) {
            if (Str::startsWith($pattern, 'https://')) {
                $pattern = 'http://' . Str::after($pattern, 'https://');
            }
            return Str::is($pattern, $link['type']);
        };

        collect()
            ->merge($this->presets->filter($filter)->values())
            ->merge($this->links->filter($filter)->values())
            ->each(function ($config) use (&$spec) {
                if (!is_array($config)) {
                    return;
                }
                foreach ($config as $key => $list) {
                    if (is_array($spec[$key]) && is_array($list)) {
                        $spec[$key] = array_merge($spec[$key], $list);
                    } else {
                        $spec[$key] = $list;
                    }
                }
            });

        return $spec;
    }

    public function parseLink($value, $includeType = false)
    {
        if (!isset($value)) {
            return;
        }

        $kind     = null;
        $type     = null;
        $link     = null;
        $query    = null;
        $fragment = null;
        $id       = null;

        $url = parse_url($value);

        if (isset($url['query'])) {
            $before = Str::before($value, '?');
        } else if (isset($url['fragment'])) {
            $before = Str::before($value, '#');
        } else {
            $before = $value;
        }

        $query    = $url['query'] ?? null;
        $fragment = $url['fragment'] ?? null;

        if (Str::startsWith($value, 'entry::')) {

            $kind = 'entry';
            $link = $before;
            $id   = Str::after($link, 'entry::');
            if ($includeType) {
                $entry = Entry::find($id);
                if ($entry && $entry->url()) {
                    $type = 'entry::' . $entry->collection()->handle() . '/' . $entry->blueprint()->handle();
                }
            }

        } else if ($value !== '@child') {

            $kind = 'url';
            $link = $value;
            if ($includeType) {
                $type = $before;
                if (Str::startsWith($type, 'https://')) {
                    $type = 'http://' . Str::after($type, 'https://');
                }
            }
            
        }
        
        return [
            'value'    => $value,
            'kind'     => $kind,
            'type'     => $type,
            'link'     => $link,
            'query'    => $query,
            'fragment' => $fragment,
            'id'       => $id,
        ];
    }
    
}