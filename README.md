<!-- statamic:hide -->

![Statamic](https://flat.badgen.net/badge/Statamic/3.2+/FF269E)
![Packagist version](https://flat.badgen.net/packagist/v/jacksleight/statamic-link-fragment-fieldtype)
![License](https://flat.badgen.net/github/license/jacksleight/statamic-link-fragment-fieldtype)

# Lazy Logo 

<!-- /statamic:hide -->

This Statamic addon allows you to link to page fragment IDs by selecting from an automatically populated list or inputting a custom value.

## Installation

You can search for this addon in the `Tools > Addons` section of the Statamic control panel and click **install**, or run the following command from your project root:

``` bash
composer require jacksleight/statamic-link-fragment-fieldtype
```

## Configuration

If you want to configure the rules used to scan pages for IDs you can publish and edit the config:

```bash
php please vendor:publish --tag=statamic-link-fragment-fieldtype-config
```

Then open `config/statamic/link-fragment-fieldtype.php`.

You can define rules for entry pages and URL pages per-host, for example:

```php
'url_rules' => [
    'statamic.dev' => [
        'within' => '#content',
        'except' => [
            '#table-of-contents'
        ],
    ],
],
```

This is telling the scanner to only look within the `#content` element and to exclude the `#table-of-contents` fragment, when scanning statamic.dev URLs.

## Fieldtype Options

* **collections:** The collections that should be linkable
* **Scan URLs:** Whether to enable scanning of URLs (off by default)

## Compatibility

Any `link` field can be converted to a `link_fragment` field and the values will be carried through.
