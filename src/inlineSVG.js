(function (root, factory) {

  if(typeof define === 'function' && define.amd) {
    define([], factory(root));
  } else if (typeof exports === 'object') {
    module.exports = factory(root);
  } else {
    root.inlineSVG = factory(root);
  }

})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {

  // Variables
  var inlineSVG = {},
      supports = !!document.querySelector && !!root.addEventListener,
      settings;

  // Defaults
  var defaults = {
    initClass: 'js-inlinesvg',
    svgSelector: 'img.svg'
  };

  /**
   * Stolen from underscore.js
   * @private
   * @param {Int} times
   * @param {Function} func
   */

  var after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  /**
   * Merge two objects together
   * @private
   * @param {Function} fn
   */
  var extend = function () {

    // Variables
    var extended = {};
    var deep = false;
    var i = 0;
    var length = arguments.length;

    // Check if a deep merge
    if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
      deep = arguments[0];
      i++;
    }

    // Merge the object into the extended object
    var merge = function (obj) {
      for ( var prop in obj ) {
        if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
          // If deep merge and property is an object, merge properties
          if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
            extended[prop] = extend( true, extended[prop], obj[prop] );
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };

    // Loop through each object and conduct a merge
    for ( ; i < length; i++ ) {
      var obj = arguments[i];
      merge(obj);
    }

    return extended;

  };

  // Methods

  /**
   * Grab all the SVGs that match the selector
   * @public
   */
  var getAll = function () {

    var svgs = document.querySelectorAll(settings.svgSelector);
    return svgs;

  };

  /**
   * Inline all the SVGs in the array
   * @public
   */
  var inliner = function (cb) {

    var svgs = getAll();
    var callback = after(svgs.length, cb);

    Array.prototype.forEach.call(svgs, function (svg, i) {

      // Store some attributes of the image
      var src = svg.src || svg.getAttribute('data-src'),
          attributes = svg.attributes;

      // Get the contents of the SVG
      var request = new XMLHttpRequest();
      request.open('GET', src, true);

      request.onload = function () {

        if(request.status >= 200 && request.status < 400) {

          // Setup a parser to convert the response to text/xml in order for it
          // to be manipulated and changed
          var parser = new DOMParser(),
              result = parser.parseFromString(request.responseText, 'text/xml'),
              inlinedSVG = result.getElementsByTagName('svg')[0];

          // Remove some of the attributes that aren't needed
          inlinedSVG.removeAttribute('xmlns:a');
          inlinedSVG.removeAttribute('width');
          inlinedSVG.removeAttribute('height');
          inlinedSVG.removeAttribute('x');
          inlinedSVG.removeAttribute('y');
          inlinedSVG.removeAttribute('enable-background');
          inlinedSVG.removeAttribute('xmlns:xlink');
          inlinedSVG.removeAttribute('xml:space');
          inlinedSVG.removeAttribute('version');

          // Add in the attributes from the original <img> except `src` or
          // `alt`, we don't need either
          Array.prototype.slice.call(attributes).forEach(function(attribute) {
            if(attribute.name !== 'src' && attribute.name !== 'alt') {
              inlinedSVG.setAttribute(attribute.name, attribute.value);
            }
          });

          // Add an additional class to the inlined SVG to imply it was
          // infact inlined, might be useful to know
          if (inlinedSVG.classList) {
            inlinedSVG.classList.add('inlined-svg');
          } else {
            inlinedSVG.className += ' ' + 'inlined-svg';
          }

          // Add in some accessibility quick wins
          inlinedSVG.setAttribute('role', 'img');

          // Use the `longdesc` attribute if one exists
          if(attributes.longdesc) {
            var description = document.createElementNS('http://www.w3.org/2000/svg', 'desc'),
                descriptionText = document.createTextNode(attributes.longdesc.value);

            description.appendChild(descriptionText);
            inlinedSVG.insertBefore(description, inlinedSVG.firstChild);
          }

          // Use the `alt` attribute if one exists
          if(attributes.alt) {
            inlinedSVG.setAttribute('aria-labelledby', 'title');

            var title = document.createElementNS('http://www.w3.org/2000/svg', 'title'),
                titleText = document.createTextNode(attributes.alt.value);

            title.appendChild(titleText);
            inlinedSVG.insertBefore(title, inlinedSVG.firstChild);
          }

          // Replace the image with the SVG
          svg.parentNode.replaceChild(inlinedSVG, svg);

          // Fire the callback
          callback(settings.svgSelector);

        } else {

          console.error('There was an error retrieving the source of the SVG.');

        }

      };

      request.onerror = function () {
        console.error('There was an error connecting to the origin server.');
      };

      request.send();

    });

  };

  /**
   * Initialise the inliner
   * @public
   */
  inlineSVG.init = function (options, callback) {

    // Test for support
    if (!supports) return;

    // Merge users option with defaults
    settings = extend(defaults, options || {});

    // Kick-off the inliner
    inliner(callback || function(){});

    // Once inlined and a class to the HTML
    document.documentElement.className += ' ' + settings.initClass;

  };

  return inlineSVG;

});
