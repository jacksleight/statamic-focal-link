<?php

namespace JackSleight\StatamicLinkFragmentFieldtype\Fieldtypes;

use Statamic\Fields\Fieldtype;
use Statamic\Fields\Field;
use Facades\Statamic\Routing\ResolveRedirect;
use JackSleight\StatamicLinkFragmentFieldtype\Facades\Utilities;

class LinkFragment extends Fieldtype
{
    protected $icon = 'link';

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
        ) = Utilities::parseValue($value);
        
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
        ) = Utilities::parseValue($value);

        list(
            $linkType,
            $linkVariant,
        ) = Utilities::parseLink($linkValue);

        $linkFieldtype = $this->nestedLinkFieldtype($linkValue);
        $linkSpec = Utilities::getSpec($linkType, $linkVariant);

        return [
            'initialLink' => $linkValue,
            'initialQuery' => $queryValue,
            'initialFragment' => $fragmentValue,
            'linkSpec' => $linkSpec,
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