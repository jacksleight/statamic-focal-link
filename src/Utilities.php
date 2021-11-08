<?php

namespace JackSleight\StatamicLinkFragmentFieldtype;

use Exception;
use Str;
use Statamic\Facades\Entry;

class Utilities
{   
    public function getSpec($type, $variant)
    {
        if (!isset($type) || !isset($variant)) {
            return;
        }

        $data = config('statamic.link_fragment_fieldtype');

        $spec =
            $data["{$type}:{$variant}"] ??
            $data["{$type}:*"] ??
            $data["*"] ??
            null;
        if (!isset($spec)) {
            return [
                'queries'    => false,
                'fragments'  => false,
                'discover'   => false,
                'discovered' => false,
            ];
        }

        $spec += [
            'queries'    => [],
            'fragments'  => [],
            'discover'   => false,
            'discovered' => false,
        ];

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
        $linkType    = null;
        $linkVariant = null;
        $linkId      = null;

        if (isset($link)) {

            if (Str::startsWith($link, 'entry::')) {
                $linkId      = Str::after($link, 'entry::');
                $linkType    = 'entry';
                $linkVariant = Entry::find($linkId)->collection()->handle();
            } else if (Str::startsWith($link, 'http://') || Str::startsWith($link, 'https://')) {
                $linkId      = $link;
                $linkType    = 'http';
                $linkVariant = parse_url($link)['host'];
            }
            
        }
        
        return [
            $linkType,
            $linkVariant,
            $linkId,
        ];
    }
}