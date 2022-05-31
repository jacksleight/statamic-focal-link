<?php

namespace JackSleight\StatamicFocalLink;

use DOMAttr;
use DOMDocument;
use DOMElement;
use DOMXPath;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Statamic\Facades\Entry;
use Symfony\Component\HttpFoundation\Request as SymfonyRequest;

class Scanner
{
    protected $ignoreTags = [
        'script',
        'svg',
    ];

    public function scan($link, $spec)
    {
        if (! isset($link) || ! is_array($spec['discovery'])) {
            return $spec;
        }

        $html = null;

        if ($link['option'] === 'entry') {
            $html = $this->fetchEntryHtml($link['id']);
        } elseif ($link['option'] === 'url') {
            $html = $this->fetchUrlHtml($link['value']);
        }

        $spec['fragments'] = array_merge(
            $spec['fragments'] ?? [],
            $this->findFragments($html, $spec)
        );

        $spec['discovered'] = true;

        return $spec;
    }

    protected function fetchEntryHtml($id)
    {
        $entry = Entry::find($id);
        if (! $entry || ! $entry->url()) {
            throw new Excpetion;
        }

        $entry = $entry->published(true);

        $request = Request::createFromBase(SymfonyRequest::create($entry->url()));
        $html = $entry->toResponse($request)->content();

        return $html;
    }

    protected function fetchUrlHtml($url)
    {
        if (Str::startsWith($url, 'http://') || Str::startsWith($url, 'https://')) {
            $html = @file_get_contents($url);
        } else {
            $html = null;
        }

        return $html;
    }

    protected function findFragments($html, $spec)
    {
        $fragments = collect();

        $dom = new DOMDocument();
        libxml_use_internal_errors(true);
        $dom->loadHTML($html);
        libxml_use_internal_errors(false);

        $xpath = new DOMXPath($dom);

        foreach ($spec['discovery'] as $targetExpr => $labelExpr) {
            $nodes = $xpath->query($targetExpr);

            foreach ($nodes as $node) {
                $targetNode = $node instanceof DOMElement
                    ? $node->getAttributeNode('id')
                    : $node;
                $value = trim($targetNode->textContent, "\n\r\t\v\0#");
                if (empty($value)) {
                    continue;
                }
                $label = Str::headline($value);

                $refNode = $node instanceof DOMAttr
                    ? $node->parentNode
                    : $node;

                $pointerNode = $refNode;
                do {
                    if ($pointerNode instanceof DOMElement && in_array($pointerNode->tagName, $this->ignoreTags)) {
                        continue 2;
                    }
                } while ($pointerNode = $pointerNode->parentNode);

                if (is_string($labelExpr)) {
                    $labelNodes = $xpath->query($labelExpr, $refNode);
                    if ($labelNodes->length) {
                        $labelNode = $labelNodes->item(0);
                        $labelText = Str::words(trim(preg_replace('/\s+/', ' ', $labelNode->textContent)), 12);
                        if (! empty($labelText)) {
                            $label = $labelText;
                        }
                    }
                }

                $fragments->put($value, $label);
            }
        }

        return $fragments->all();
    }
}
