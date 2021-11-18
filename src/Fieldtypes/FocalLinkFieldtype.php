<?php

namespace JackSleight\StatamicFocalLink\Fieldtypes;

use Facades\Statamic\Routing\ResolveRedirect;
use JackSleight\StatamicFocalLink\Facades\Utilities;
use Statamic\Fields\Field;
use Statamic\Fields\Fieldtype;

class FocalLinkFieldtype extends Fieldtype
{
    protected $icon = 'link';

    public static function title()
    {
        return __('Focal Link');
    }

    protected function configFieldItems(): array
    {
        return [
            'collections' => [
                'display' => __('Collections'),
                'instructions' => __('statamic::fieldtypes.link.config.collections'),
                'type' => 'collections',
                'mode' => 'select',
            ],
        ];
    }

    public function augment($value)
    {
        if (! isset($value)) {
            return;
        }

        $link = Utilities::parseLink($value);

        $redirect = ResolveRedirect::resolve($link['link'], $this->field->parent());

        if ($redirect === 404) {
            return null;
        }

        if ($link['option'] === 'entry') {
            if (isset($link['query'])) {
                $redirect .= "?{$link['query']}";
            }
            if (isset($link['fragment'])) {
                $redirect .= "#{$link['fragment']}";
            }
        }

        return $redirect;
    }

    public function preload()
    {
        $value = $this->field->value();

        $link = Utilities::parseLink($value, true);
        $spec = Utilities::getSpec($link);

        $linkFieldtype = $this->nestedLinkFieldtype($link['link'] ?? null);

        return [
            'initialLink' => $link['link'] ?? null,
            'initialQuery' => $link['query'] ?? null,
            'initialFragment' => $link['fragment'] ?? null,
            'nestedType' => $this->config('nested_type', 'link'),
            'spec' => $spec,
            'link' => [
                'config' => $linkFieldtype->config(),
                'meta' => $linkFieldtype->preload(),
            ],
        ];
    }

    protected function nestedLinkFieldtype($value): Fieldtype
    {
        $linkField = (new Field('link', [
            'type' => $this->config('nested_type', 'link'),
        ]));

        $linkField->setValue($value);

        $linkField->setConfig(array_merge(
            $linkField->config(),
            ['collections' => $this->config('collections')]
        ));

        return $linkField->fieldtype();
    }
}
