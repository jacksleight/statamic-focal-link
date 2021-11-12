<!-- statamic:hide -->

![Statamic](https://flat.badgen.net/badge/Statamic/3.2+/FF269E)
![Packagist version](https://flat.badgen.net/packagist/v/jacksleight/statamic-focal-link)
![License](https://flat.badgen.net/github/license/jacksleight/statamic-focal-link)

# Statamic Focal Link

<!-- /statamic:hide -->

This Statamic fieldtype simplifies linking to entry/URL fragment identifiers and query strings. It supports automatic ID discovery, predefined options, option templates and manual input.

## Installation

You can search for this addon in the `Tools > Addons` section of the Statamic control panel and click **install**, or run the following command from your project root:

``` bash
composer require jacksleight/statamic-focal-link
```

## Configuration

You can configure which options are avaliable for each type of link by publishing the config:

```bash
php please vendor:publish --tag=statamic-focal-link-config
```

And then opening `config/statamic/focal_link.php` and editing the `links` list.

### Link Matching Patterns

Each key in the list should be a pattern that matches a type of link:

* Entry links use the pattern `entry::[collection]/[blueprint]`
* URL links use the full URL up to the end of the path (`https` will be mapped to `http` automatically)

You can use asterisks in the pattern to perform wildcard matches.

### Query & Fragment Options

Options can either be a fixed value or a template value. Templates must contain the string `{{ [placeholder] }}`, this where the cursor will be placed when the template is selected.

### Fragment Identifier Discovery

You can enable automatic ID discovery by setting the `discovery` option to an array of XPath expressions, these will be used to find matching elements in the destination page.

The array keys should be the path to the elements containing the ID attribute, the values should be the path to the node that contains the label, relative to the element. If you set the value to `true` a label will be generated from the ID using `Str::headline()`.

### Example Configuration

```php
/*
The link pattern
*/
'entry::products/*' => [ // All blueprints within the products collection

    /*
    Query string options
    */
    'queries' => [
        "size=large"      => "Size — Large" // A fixed option
        "size={{ size }}" => "Size" // A template option
    ],

    /*
    Fragment itentifier options
    */
    'fragments' => [
        "reviews"            => "Reviews" // A fixed option
        ":~:text={{ text }}" => "Text Fragment", // A template option
    ],

    /*
    Fragment identifier discovery options
    */
    'discovery' => [
        "//*[@id]" => "text()", // Match all elements with an ID attribute and use the text content as a label
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