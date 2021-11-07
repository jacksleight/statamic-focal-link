<?php

namespace JackSleight\StatamicLinkFragmentFieldtype\Fieldtypes;

use Str;
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
        list(
            $linkValue,
            $queryValue,
            $fragmentValue,
        ) = $this->parseValue($value);

        $redirect = ResolveRedirect::resolve($linkValue, $this->field->parent());

        if ($redirect === 404) {
            return null;
        }

        if (isset($queryValue)) {
            $redirect .= "?{$queryValue}";
        }
        if (isset($fragmentValue)) {
            $redirect .= "#{$fragmentValue}";
        }

        return $redirect;
    }

    public function preload()
    {
        $value = $this->field->value();

        list(
            $linkValue,
            $queryValue,
            $fragmentValue,
        ) = $this->parseValue($value);

        $linkFieldtype     = $this->nestedLinkFieldtype($linkValue);
        $queryFieldtype    = $this->nestedQueryFieldtype($queryValue);
        $fragmentFieldtype = $this->nestedFragmentFieldtype($fragmentValue);

        return [
            'initialLink' => $linkValue,
            'initialQuery' => $queryValue,
            'initialFragment' => $fragmentValue,
            'link' => [
                'config' => $linkFieldtype->config(),
                'meta' => $linkFieldtype->preload(),
            ],
            'query' => [
                'config' => $queryFieldtype->config(),
                'meta' => $queryFieldtype->preload(),
            ],
            'fragment' => [
                'config' => $fragmentFieldtype->config(),
                'meta' => $fragmentFieldtype->preload(),
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

    protected function nestedQueryFieldtype($value): Fieldtype
    {
        $queryField = (new Field('fragment', [
            'type' => 'select',
            'taggable' => true,
        ]));

        $queryField->setValue($value);

        return $queryField->fieldtype();
    }

    protected function nestedFragmentFieldtype($value): Fieldtype
    {
        $fragmentField = (new Field('fragment', [
            'type' => 'select',
            'taggable' => true,
        ]));

        $fragmentField->setValue($value);

        return $fragmentField->fieldtype();
    }

    protected function parseValue($value)
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
}