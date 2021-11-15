<?php

namespace JackSleight\StatamicFocalLink;

use Statamic\Facades\Entry;
use Str;

class Utilities
{
    protected $specs;

    public function __construct($links, $presets)
    {
        $this->specs = collect($links)->union($presets)->reverse();
    }

    public function getSpec($link)
    {
        if (! isset($link)) {
            return;
        }

        $spec = [
            'queries'    => null,
            'fragments'  => null,
            'discovery'  => null,
            'discovered' => false,
        ];

        $match = $this->specs
            ->search(function ($config, $pattern) use ($link) {
                return Str::is($this->normalizeUrl($pattern), $link['type']);
            });

        if ($match) {
            $spec = $this->specs->get($match) + $spec;
        }

        return $spec;
    }

    public function parseLink($value, $includeType = false)
    {
        if (! isset($value)) {
            return;
        }

        $option = null;
        $type = null;
        $link = null;
        $query = null;
        $fragment = null;
        $id = null;

        $url = parse_url($value);

        if (isset($url['query'])) {
            $before = Str::before($value, '?');
        } elseif (isset($url['fragment'])) {
            $before = Str::before($value, '#');
        } else {
            $before = $value;
        }

        $query = $url['query'] ?? null;
        $fragment = $url['fragment'] ?? null;

        if (Str::startsWith($value, 'entry::')) {
            $option = 'entry';
            $link = $before;
            $id = Str::after($link, 'entry::');
            if ($includeType) {
                $entry = Entry::find($id);
                if ($entry && $entry->url()) {
                    $type = 'entry::'.$entry->collection()->handle().'/'.$entry->blueprint()->handle();
                }
            }
        } elseif ($value !== '@child') {
            $option = 'url';
            $link = $value;
            if ($includeType) {
                $type = $this->normalizeUrl($before);
            }
        }

        return [
            'value'    => $value,
            'option'     => $option,
            'type'     => $type,
            'link'     => $link,
            'query'    => $query,
            'fragment' => $fragment,
            'id'       => $id,
        ];
    }

    public function normalizeUrl($url)
    {
        if (Str::startsWith($url, 'https://')) {
            $url = 'http://'.Str::after($url, 'https://');
        }
        if (Str::startsWith($url, 'http://www.')) {
            $url = 'http://'.Str::after($url, 'http://www.');
        }

        return $url;
    }
}
