<!-- statamic:hide -->

![Statamic](https://flat.badgen.net/badge/Statamic/3.2+/FF269E)
![Packagist version](https://flat.badgen.net/packagist/v/jacksleight/statamic-focal-link)
![License](https://flat.badgen.net/github/license/jacksleight/statamic-focal-link)

# Statamic Focal Link

<!-- /statamic:hide -->

This Statamic fieldtype streamlines linking to entry/URL fragment identifiers and query strings. It supports automatic ID discovery, predefined options, option templates and manual input. Automatic ID discovery works by scanning the destination page for fragment identifiers and then allowing you to select one from a list. You can control exactly which IDs are discovered using XPath expressions.

## Installation

You can search for this addon in the `Tools > Addons` section of the Statamic control panel and click **install**, or run the following command from your project root:

``` bash
composer require jacksleight/statamic-focal-link
```

## Configuration

The default configuration comes with a couple of examples to get you started, but as every site is different you'll need to tell it what to enable and how for best results. To do this publish the config:

```bash
php please vendor:publish --tag=statamic-focal-link-config
```

And then open `config/statamic/focal_link.php`. 

## Getting Started

Each key in the `types` list should be a pattern that matches a type of link. These can contain asterisks to perform wildcard matches. They should be in order of specificity (lowest to highest), the most specific match will be used.

* Entry link types use the pattern: `entry::[collection]/[blueprint]`
* URL link types use the pattern: `[protocol][host][port?][path]`
    * Basically the full URL up to the end of the path
    * `http(s)` and `www` will be normalized automatically

Each type can contain the following settings:

* **queries:** A value/label array of query string options or templates
* **fragments:** A value/label array of fragment identifier options or templates
* **discovery:** A value/label array of XPath expressions used to find fragment identifiers in the destination page

If **queries** or **fragments** are excluded those fields will not appear at all.

### Query & Fragment Options

Options can either be a fixed value or a template value. Templates must contain the string `{{ [placeholder] }}`, this where the cursor will be placed when the template is selected.

### Fragment Identifier Discovery

You can enable automatic ID discovery by setting the `discovery` option to an array of XPath expressions, these will be used to find matching elements in the destination page.

The key should be the path to the elements containing the ID attribute, the value should be the path to the node that contains the label relative to the element. If the value is not set or the node cannot be found a label will be generated from the ID using `Str::headline()`.

### Example Link Type Settings

```php
'entry::products/*' => [ // All entries within the products collection

    'queries' => [
        "size=large" => "Size — Large" // A fixed option
        "size={{ medium }}" => "Size" // A template option
    ],

    'fragments' => [
        "reviews" => "Reviews" // A fixed option
        ":~:text={{ text }}" => "Text Fragment", // A template option
    ],

    'discovery' => [
        "//*[@id]" => "text()", // Elements with an ID attribute, with the text content as a label
    ],

],
```

Check out the [included presets](https://github.com/jacksleight/statamic-focal-link/blob/main/resources/data/presets.php) for more examples.

## Fieldtype Options

* **collections:** The collections that should be linkable

## Automatic Heading IDs 

**Shameless Plug:** You can use my [Bard Mutator](https://statamic.com/addons/jacksleight/bard-mutator) addon to automatically apply IDs to heading elements rendered by the Bard fieldtype, and then use this addon to link directly to them. Here's the mutator function you'll need:

```php
use JackSleight\StatamicBardMutator\Facades\Mutator;

Mutator::tag('heading', function ($tag, $data) {
    $tag[0]['attrs']['id'] = str_slug(collect($data->content)->implode('text', ''));
    return $tag;
});
```

## Popular Site Presets

The addon comes with a handful of presets for popular sites. If you know of others and would like them added feel free to submit an issue or PR.

## Link Fieldtype Compatibility

I’ve tried to make this fieldtype work as seamlessly as possible with the built-in Link fieldtype. Depending on the link this either stores values in an identical format or a suffixed format.

Any Link field can be changed to a Focal Link field and the values will be compatible. If you change a Focal Link field back to a Link field Entry values with a query or fragment set will not be compatible, the suffixes will need to be removed.

<!-- statamic:hide -->

## Licencing

Statamic Memberbox is not free software. You will need to purchase a license via the [Statamic Marketplace](https://statamic.com/addons/jacksleight/memberbox) to use it in production.

<!-- /statamic:hide -->
