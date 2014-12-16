# Inline SVG

[![Build Status](https://travis-ci.org/jonnyhaynes/inline-svg.svg?branch=master)](https://travis-ci.org/jonnyhaynes/inline-svg)

Takes an inline `<img>` with an SVG as its source and swaps it for an inline `<svg>` so you can manipulate the style of it with CSS/JS etc.

Based on this [Stack Overflow](http://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement) post's answer by [Drew Baker](http://stackoverflow.com/users/503546/drew-baker) with some enhancements from myself and [Oliver Farrell](https://github.com/oliverfarrell).

## How to use

Use an `<img>` tag in your HTML to embed an SVG graphic. Use something like Adobe Illustrator to make the graphic and save out the SVG file.

`<img id="logo" class="svg" src="/images/logo.svg" alt="Some awesome company" />`

This is just like how you'd embed a normal image. Note that you need to set the `<img>` to have a class of svg. You can have more than one class, but the svg class is required. The ID is not required.

What the code does is look for all `<img>`s with a class of svg and replaces them with the inline SVG from the linked file. You can now manipulate the ANY part of the SVG, be it the `<path>` or a group (`<g>`). See below:

```
svg:hover path {
  fill: #c00;
}
```

Because the code also ports across the original images ID and classes, this CSS works too:

```
#logo:hover path {
  fill: #c00;
}
```

For increased accessibility the code will copy across the `<img>`'s alt text and add in an `aria-label` and `<title>` to the SVG as per the [W3C's guidelines](http://www.w3.org/TR/SVG-access/) on SVG accessibility.

For a live demo check out this [example on CodePen](http://codepen.io/oliverfarrell/pen/GgqJvB).

## Bower

If you're using [Bower](bower.io) to manage your front-end dependencies you can include this plugin as a component. Include `"inline-svg": "1.0.4"` in your `bower.json` file and run `bower install`.

## Browser support

As the script utilises `querySelectorAll` to grab all the instances of `<img class="svg" />` the browser support matrix looks something like this:

- Internet Explorer 8+
- Firefox 3.5+
- Chrome 4+
- Safari 3.1+
- Opera 10.1+

However it's recommended that you check inline SVG browser support [here](http://caniuse.com/#search=inline%20svg) as it's not necessarily the same as above.

## Changelog

- **16/12/14:** 1.0.4 – Updated README with new CodePen demo and added an extra line regarding browser support. Changed `aria-label` to `aria-labelledby` and also added `role="img"` for better accessibility.
- **15/12/14:** 1.0.3 – Updated bower.json version number.
- **15/12/14:** 1.0.2 – README updates to explain browser support.
- **15/12/14:** 1.0.1 – README updates to explain Bower integration.
- **15/12/14:** 1.0.0 – First major release: registered as a Bower plugin.
