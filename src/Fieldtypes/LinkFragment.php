<?php

namespace JackSleight\StatamicLinkFragmentFieldtype\Fieldtypes;

use Statamic\Fields\Fieldtype;
use Statamic\Fields\Field;
use Facades\Statamic\Routing\ResolveRedirect;

class LinkFragment extends Fieldtype
{
    protected $icon = 'link';

    protected $defaultValue = [
        'link'     => null,
        'fragment' => null,
    ];

    public static function title()
    {
        return __('Link Fragment');
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
        $value = $this->normalizeValue($value);

        $redirect = ResolveRedirect::resolve($value['link'], $this->field->parent());

        if ($redirect === 404) {
            return null;
        }

        if (isset($value['fragment'])) {
            $redirect .= $value['fragment'];
        }

        return $redirect;
    }

    public function preload()
    {
        $value = $this->normalizeValue($this->field->value());

        $linkFieldtype = $this->nestedLinkFieldtype($value['link']);

        $fragmentFieldtype = $this->nestedFragmentFieldtype($value['fragment']);

        return [
            'initialLink' => $value['link'],
            'initialFragment' => $value['fragment'],
            'link' => [
                'config' => $linkFieldtype->config(),
                'meta' => $linkFieldtype->preload(),
            ],
            'fragment' => [
                'config' => $fragmentFieldtype->config(),
                'meta' => $fragmentFieldtype->preload(),
            ],
        ];
    }

    private function nestedLinkFieldtype($value): Fieldtype
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

    private function nestedFragmentFieldtype($value): Fieldtype
    {
        $fragmentField = (new Field('fragment', [
            'type' => 'select',
            'taggable' => true,
        ]));

        $fragmentField->setValue($value);

        return $fragmentField->fieldtype();
    }

    private function normalizeValue($value)
    {
        if (!is_array($value)) {
            $value = [
                'link'     => $value,
                'fragment' => null,
            ];
        }
        return $value + [
            'link'     => null,
            'fragment' => null,
        ];
    }
}