<!-- statamic:hide -->

![Statamic](https://flat.badgen.net/badge/Statamic/3.2+/FF269E)
![Packagist version](https://flat.badgen.net/packagist/v/jacksleight/statamic-focal-link)
![License](https://flat.badgen.net/github/license/jacksleight/statamic-focal-link)

# Statamic Link Fragment Fieldtype

<!-- /statamic:hide -->

This Statamic fieldtype simplifies linking to entry and URL fragment identifiers and query strings. It supports automatic ID discovery, common format templates, predefined options and manual input.

## Installation

You can search for this addon in the `Tools > Addons` section of the Statamic control panel and click **install**, or run the following command from your project root:

``` bash
composer require jacksleight/statamic-focal-link
```

## Configuration

If you want to configure the rules used to scan pages for IDs you can publish and edit the config:

```bash
php please vendor:publish --tag=statamic-focal-link-config
```

Then open `config/statamic/focal-link.php`.

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
* **scan_urls:** Whether to enable scanning of URLs (off by default)

## Shameless Plug

## Compatibility with the Link fieldtype

I’ve tried to make this fieldtype work as seamlessly as possible with the built-in Link fieldtype. Depending on the link this either stores values in an identical or suffixed format.

Any Link field can be changed to a Focal Link field and the values will be compatible. If you change a Focal Link field back to a Link field Entry values with a query or fragment set will not be compatible, unless the suffixes are removed.
