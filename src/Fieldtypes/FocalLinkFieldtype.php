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
        if (! isset($link)) {
            return;
        }

        $link = Utilities::parseLink($value);

        $redirect = ResolveRedirect::resolve($link['link'], $this->field->parent());

        if ($redirect === 404) {
            return null;
        }

        if ($link['kind'] === 'entry') {
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

        $linkFieldtype = $this->nestedLinkFieldtype($link['link']);

        return [
            'initialLink' => $link['link'],
            'initialQuery' => $link['query'],
            'initialFragment' => $link['fragment'],
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
            'type' => 'link',
        ]));

        $linkField->setValue($value);

        $linkField->setConfig(array_merge(
            $linkField->config(),
            ['collections' => $this->config('collections')]
        ));

        return $linkField->fieldtype();
    }
}
