<!-- statamic:hide -->

![Statamic](https://flat.badgen.net/badge/Statamic/3.2+/FF269E)
![Packagist version](https://flat.badgen.net/packagist/v/jacksleight/statamic-focal-link)
![License](https://flat.badgen.net/github/license/jacksleight/statamic-focal-link)

# Statamic Focal Link

<!-- /statamic:hide -->

This Statamic fieldtype streamlines linking to entry/URL fragment identifiers and query strings. It supports automatic ID discovery, predefined options, option templates and manual input.

## Installation

You can search for this addon in the `Tools > Addons` section of the Statamic control panel and click **install**, or run the following command from your project root:

``` bash
composer require jacksleight/statamic-focal-link
```

## Configuration

As every site is different Focal Link does not make any assumptions about what to enable, you'll need to tell it which fields and options should be made avaliable by publishing the config:

```bash
php please vendor:publish --tag=statamic-focal-link-config
```

And then opening `config/statamic/focal_link.php` and editing the `types` list. 

### The Basics

Each key in the list should be a pattern that matches a type of link, these can contain asterisks to perform wildcard matches. They should be in order of specificity, most specific last.

* Entry link types use the pattern `entry::[collection]/[blueprint]`
* URL link types use the full URL up to the end of the path

Each type can contain the following settings:

* **queries:** A value/label list of query string options/templates for this link type
* **fragments:** A value/label list of fragment identifier options/templates for this link type
* **discovery:** A value/label list of XPath expressions used to find fragment identifiers in the destination page

If **queries** or **fragments** are excluded entirely those fields will not appear at all.

### Query & Fragment Options

Options can either be a fixed value or a template value. Templates must contain the string `{{ [placeholder] }}`, this where the cursor will be placed when the template is selected.

### Fragment Identifier Discovery

You can enable automatic ID discovery by setting the `discovery` option to an array of XPath expressions, these will be used to find matching elements in the destination page.

The key should be the path to the elements containing the ID attribute, the value should be the path to the node that contains the label, relative to the element. If you set the value to `true` a label will be generated from the ID using `Str::headline()`.

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

## Common Format & Popular Site Presets

The addon comes with a handful of presets for common formats and popular sites. I would like to grow this list so if you know of others and would like them added feel free to submit an issue or PR.

## Link Fieldtype Compatibility

I’ve tried to make this fieldtype work as seamlessly as possible with the built-in Link fieldtype. Depending on the link this either stores values in an identical format or a suffixed format.

Any Link field can be changed to a Focal Link field and the values will be compatible. If you change a Focal Link field back to a Link field Entry values with a query or fragment set will not be compatible, the suffixes will need to be removed.