<?php

namespace JackSleight\StatamicLinkFragmentFieldtype;

use DOMDocument;
use DOMXPath;
use Str;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Request as SymfonyRequest;
use Statamic\Facades\Entry;

class Scanner
{
    protected $filter;

    public function filter(callable $filter)
    {
        $this->filter = $filter;
    }

    public function scan($link)
    {
        $html = null;

        if (Str::startsWith($link, 'entry::')) {
            $id = Str::after($link, 'entry::');
            $html = $this->getEntryHtml($id);
        } else if (Str::startsWith($link, 'http://')) {
            $html = $this->getUrlHtml($link);
        } else if (Str::startsWith($link, 'https://')) {
            $html = $this->getUrlHtml($link);
        }

        $fragments = $this->getFragments($html);

        return $fragments;
    }

    protected function getEntryHtml($id)
    {
        $entry = Entry::find($id);

        if (!$entry || !$entry->url()) {
            return;
        }

        $entry = $entry->published(true);

        $request = Request::createFromBase(SymfonyRequest::create($entry->url()));
        $html = $entry->toResponse($request)->content();

        return $html;
    }

    protected function getUrlHtml($url)
    {
        $html = @file_get_contents($url);

        return $html ?? null;
    }

    protected function getFragments($html)
    {
        $toNull = fn ($value) => empty($value) ? null : $value;

        $fragments = collect();

        $dom = new DOMDocument();
        libxml_use_internal_errors(true);
        $dom->loadHTML($html);
        libxml_use_internal_errors(false);

        $xpath = new DOMXPath($dom);

        $nodes = $xpath->query('//*[@id]');
        foreach ($nodes as $node) {
            $id = $node->getAttribute('id');
            $value = '#' . $id;
            $title =
                $toNull($node->getAttribute('data-fragment')) ??
                $toNull($node->getAttribute('title'));
            $display = $title
                ? "{$title} — $value"
                : "$value";
            $fragments->put($value, $display);
        }

        if ($this->filter) {
            $fragments = $fragments->filter($this->filter);
        }

        return $fragments;
    }
}