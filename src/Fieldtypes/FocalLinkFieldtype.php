<?php

namespace JackSleight\StatamicFocalLink\Fieldtypes;

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
        $link = Utilities::parseLink($value);

        if (! isset($link['link'])) {
            return;
        }

        $linkFieldtype = $this->nestedLinkFieldtype($link['link']);

        $augmented = $linkFieldtype->augment($link['link']);

        if (! isset($augmented)) {
            return null;
        }

        if ($link['option'] !== 'url') {
            if (isset($link['query'])) {
                $augmented .= "?{$link['query']}";
            }
            if (isset($link['fragment'])) {
                $augmented .= "#{$link['fragment']}";
            }
        }

        return $augmented;
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
