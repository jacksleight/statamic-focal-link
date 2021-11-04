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
    public function scan($link)
    {
        $html  = null;
        $rules = null;

        $config = config("statamic.link-fragment-fieldtype");

        if (Str::startsWith($link, 'entry::')) {
            $id    = Str::after($link, 'entry::');
            $html  = $this->getEntryHtml($id);
            $rules = $config['entry_rules'] ?? null;
        } else if (Str::startsWith($link, 'http://') || Str::startsWith($link, 'https://')) {
            $html  = $this->getUrlHtml($link);
            $host  = parse_url($link)['host'];
            $rules = $config["url_rules"][$host] ?? null;
        }

        $fragments = $this->getFragments($html, $rules);

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

    protected function getFragments($html, $rules)
    {
        $toNull = fn ($value) => empty($value) ? null : $value;

        $fragments = collect();

        $dom = new DOMDocument();
        libxml_use_internal_errors(true);
        $dom->loadHTML($html);
        libxml_use_internal_errors(false);

        $xpath = new DOMXPath($dom);

        $root = isset($rules['within'])
            ? $dom->getElementById(Str::after($rules['within'], '#'))
            : $dom->getElementsByTagName('body')->item(0);

        $nodes = $xpath->query('.//*[@id]', $root);
        foreach ($nodes as $node) {
            $value = '#' . $node->getAttribute('id');
            $title =
                $toNull($node->getAttribute('data-fragment-title')) ??
                $toNull($node->getAttribute('title'));
            $display = $title
                ? "{$value} — {$title}"
                : "{$value}";
            $fragments->put($value, $display);
        }

        if (isset($rules['except'])) {
            $fragments = $fragments->except($rules['except']);
        }

        return $fragments;
    }
}