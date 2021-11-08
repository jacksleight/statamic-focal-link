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

You can configure which options are offered for different link variants by publishing the config:

```bash
php please vendor:publish --tag=statamic-focal-link-config
```

And then opening `config/statamic/focal_link.php`.

Each key in the confguration relates to a specific link variant. Entry links are defined with an `entry:[collection]` key, URL links are defined with an `http:[host]` key. You can also define fallback settings per type, or globally with an asterisk eg. `entry:*` and just `*`.

Query and fragment options can either be a fixed value or a template value. Templates must contain the string `{{}}`, which is where the cursor will be placed when the template is selected.

You can enable automatic ID discovery by setting the `discover` option.

Here is an example and description of all avaliable settings:

```php
/*
The link variant key
*/
'entry:products' => [

    /*
    The query string options
    Set to false to remove the query field entriely
    */
    'queries' => [
        'size=large' => 'Size — Large' // A fixed option
        'size={{}}'  => 'Size' // A template option
    ],

    /*
    The fragment itentifier options
    Set to false to remove the fragment field entriely
    */
    'fragments' => [
        'reviews'      => 'Reviews' // A fixed option
        ':~:text={{}}' => 'Text Fragment', // A template option
    ],

    /*
    ID discovery settings
    Set to true or an array to enable
    */
    'discover' => [

        /*
        Only look within this element for IDs
        Defaults to document body. Must be ether:
          - An ID selector
          - An XPath expression e.g. `//div[@id="content"]` (must start with a slash)
        */
        'within' => '#content',

        /*
        Exclude these IDs from the list
        */
        'except' => [
            'table-of-contents'
        ],

        /*
        A regex used to match the IDs
        For special cases this can also alter the IDs, see the GitHub preset 
        */
        'regex' => '^main-',

        /*
        Where to look for option labels
        If both are set and the attribute exists it will override the content value
        */
        'labels' => [
            'attribute' => 'title', // Read an attribute from the element
            'content'   => true, // Read the content of the element
            'parent'    => false, // Read the parent instead
        ],

    ],

],
```

Check the included presets for more examples.

## Fieldtype Options

* **collections:** The collections that should be linkable
* **scan_urls:** Whether to enable scanning of URLs (off by default)

## Popular Site Presets

The addon comes with a handful of presets for common formats and popular sites. You can override these in your own confguration if you need to. I would like to grow this list so if you know of others and would like them added feel free to submit an issue or PR.

## Link Fieldtype Compatibility

I’ve tried to make this fieldtype work as seamlessly as possible with the built-in Link fieldtype. Depending on the link this either stores values in an identical format or a suffixed format.

Any Link field can be changed to a Focal Link field and the values will be compatible. If you change a Focal Link field back to a Link field Entry values with a query or fragment set will not be compatible unless the suffixes are removed.

## Automatic Heading IDs 

**Shameless Plug:** You can use my [Bard Mutator](https://statamic.com/addons/jacksleight/bard-mutator) addon to automatically apply IDs to heading elements rendered by the Bard fieldtype, and then use this addon to link directly to them. Here's the mutator function you'll need:

```php
use JackSleight\StatamicBardMutator\Facades\Mutator;

Mutator::tag('heading', function ($tag, $data) {
    $tag[0]['attrs']['id'] = str_slug(collect($data->content)->implode('text', ''));
    return $tag;
});
```