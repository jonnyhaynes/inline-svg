# Inline SVG

[![Build Status](https://travis-ci.org/jonnyhaynes/inline-svg.svg?branch=master)](https://travis-ci.org/jonnyhaynes/inline-svg) [![Code Climate](https://codeclimate.com/github/jonnyhaynes/inline-svg/badges/gpa.svg)](https://codeclimate.com/github/jonnyhaynes/inline-svg) [![npm](https://img.shields.io/npm/v/inline-svg.svg)](https://www.npmjs.com/package/inline-svg) [![Bower](https://img.shields.io/bower/v/inline-svg.svg)](https://github.com/jonnyhaynes/inline-svg) [![Dependency Status](https://david-dm.org/jonnyhaynes/inline-svg.svg)](https://david-dm.org/jonnyhaynes/inline-svg)

Takes an inline `<img>` with an SVG as its source and swaps it for an inline `<svg>` so you can manipulate the style of it with CSS/JS etc.

## How to use

Add the Inline SVG script to your page and initialise the script. You can currently pass two options to the script: `svgSelector` and `initClass`. If these are left out the script will use the defaults.

```html
<script src="inlineSVG.min.js"></script>
<script>
inlineSVG.init({
  svgSelector: 'img.svg',
  initClass: 'js-inlinesvg' // class added to <html>
});
</script>
```

The script will look for any `<img>` with a class that matches the `svgSelector` parameter and replace it with the SVG's source. Doing this enables you to manipulate the SVG with CSS and JavaScript. 

```html
<img id="logo" class="svg" src="/images/logo.svg" alt="Some awesome company" />
```

```css
svg:hover path {
  fill: #c00;
}

// or
#logo:hover path {
  fill: #c00;
}
```

Any additional attributes (`height`, `width`, `data-*`, etc) will be copied to the SVG. For increased accessibility the script will also copy across the `<img>` alt text and add in an `aria-labelledby` attribute and `<title>` element to the SVG. If you give the `<img>` a `longdesc` attribute, a `<desc>` will also be added as per the [W3C's guidelines](http://www.w3.org/TR/SVG-access/) on SVG accessibility.

For a live demo check out this [example on CodePen](http://codepen.io/jonnyhaynes/pen/VYqroO).

## Bower

If you're using [Bower](bower.io) to manage your front-end dependencies you can include this plugin as a component. Include `"inline-svg": "2.0.1"` in your `bower.json` file and run `bower install`.

## NPM
If you're using NPM to manage your dependencies you can include this plugin as a module. Just run `npm install inline-svg`.

## Changelog

- **21/07/15:** 2.0.1 - Major upgrade. Added AMD support and fixed a long standing issue that would result in a warning in Google Chrome as we weren't handling the GET requests asynchronously. 
- **18/06/15:** 1.2.0 – Converted to a Node.js module
- **19/03/15:** 1.0.5 – Cleaning code to comply with Code Climate
- **16/12/14:** 1.0.4 – Updated README with new CodePen demo and added an extra line regarding browser support. Changed `aria-label` to `aria-labelledby` and also added `role="img"` for better accessibility.
- **15/12/14:** 1.0.3 – Updated bower.json version number.
- **15/12/14:** 1.0.2 – README updates to explain browser support.
- **15/12/14:** 1.0.1 – README updates to explain Bower integration.
- **15/12/14:** 1.0.0 – First major release: registered as a Bower plugin.
