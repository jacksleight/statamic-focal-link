<?php

namespace JackSleight\StatamicLinkFragmentFieldtype;

use Exception;
use DOMDocument;
use DOMXPath;
use Str;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Request as SymfonyRequest;
use Statamic\Facades\Entry;

class Scanner
{
    public function scan($type, $id, $spec)
    {
        $fragments = [];

        try {
            
            $html = null;

            if ($type === 'entry') {
                $html  = $this->fetchEntryHtml($id);
            } else if ($type === 'http') {
                $html  = $this->fetchHttpHtml($id);
            }

            $fragments = $this->findFragments($html, $spec);

        } catch (Exception $e) {
            throw $e;
        }

        return $fragments;
    }

    protected function fetchEntryHtml($id)
    {
        $entry = Entry::find($id);
        
        if (!$entry || !$entry->url()) {
            throw new Excpetion;
        }

        $entry = $entry->published(true);

        $request = Request::createFromBase(SymfonyRequest::create($entry->url()));
        $html = $entry->toResponse($request)->content();

        return $html;
    }

    protected function fetchHttpHtml($url)
    {
        $html = @file_get_contents($url);

        return $html ?? null;
    }

    protected function findFragments($html, $spec)
    {
        $toNull = fn ($value) => empty($value) ? null : $value;

        $fragments = collect();

        $dom = new DOMDocument();
        libxml_use_internal_errors(true);
        $dom->loadHTML($html);
        libxml_use_internal_errors(false);

        $xpath = new DOMXPath($dom);

        $root = isset($spec['within'])
            ? $xpath->query($this->parsePointer($spec['within']))->item(0)
            : $dom->getElementsByTagName('body')->item(0);

        $nodes = $xpath->query('.//*[@id]', $root);
        foreach ($nodes as $node) {
            $value = $node->getAttribute('id');
            if (isset($spec['except']) && in_array($value, $spec['except'])) {
                continue;
            }
            if (isset($spec['regex'])) {
                if (is_string($spec['regex'])) {
                    if (!preg_match($spec['regex'], $value)) {
                        continue;
                    }
                } else if (is_array($spec['regex'])) {
                    $pattern     = key($spec['regex']);
                    $replacement = current($spec['regex']);
                    if (!preg_match($pattern, $value)) {
                        continue;
                    } else {
                        $value = preg_replace($pattern, $replacement, $value);
                    }
                }
            }
            $label = null;
            $check = ($spec['labels']['parent'] ?? false) ? $node->parentNode : $node;
            if (isset($spec['labels']['attribute'])) {
                $label = $toNull($check->getAttribute($spec['labels']['attribute']));
            }
            if (!isset($label) && isset($spec['labels']['content'])) {
                $label = $toNull($check->textContent);
            }
            $fragments->put($value, $label ?? $value);
        }

        return $fragments->all();
    }

    protected function parsePointer($value)
    {
        if (Str::startsWith($value, '/')) {
            return $value;
        } else if (Str::startsWith($value, '#')) {
            $id = Str::after($value, '#');
            return "//*[@id='{$id}']";
        }

        throw new Exception("Invalid element pointer value: {$value}");
    }
}