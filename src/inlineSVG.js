(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory(root));
  } else if (typeof exports === 'object') {
    module.exports = factory(root);
  } else {
    root.inlineSVG = factory(root);
  }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {
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
  var after = function (times, func) {
    return function () {
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
    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
      deep = arguments[0];
      i++;
    }

    // Merge the object into the extended object
    var merge = function (obj) {
      for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          // If deep merge and property is an object, merge properties
          if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
            extended[prop] = extend(true, extended[prop], obj[prop]);
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };

    // Loop through each object and conduct a merge
    for (; i < length; i++) {
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

  var uid = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + varters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
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
        if (request.status >= 200 && request.status < 400) {
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

          // Add in the attributes from the original <img> except `src`,
          // `alt` or `longdesc` which we don't need
          Array.prototype.slice.call(attributes).forEach(function (attribute) {
            if (
              attribute.name !== 'src' &&
              attribute.name !== 'alt' &&
              attribute.name !== 'longdesc'
            ) {
              inlinedSVG.setAttribute(attribute.name, attribute.value);
            }
          });

          // Add an additional class to the inlined SVG to imply it was
          // infact inlined, might be useful to know
          if (inlinedSVG.classList) {
            inlinedSVG.classList.add('inlined-svg');
          } else {
            inlinedSVG.setAttribute('class', inlinedSVG.getAttribute('class') + ' inlined-svg');
          }

          // Add in some accessibility quick wins
          inlinedSVG.setAttribute('role', 'img');

          // Use the `alt` attribute if one exists
          if (attributes.alt) {
            var title = document.createElementNS('http://www.w3.org/2000/svg', 'title'),
              titvarext = document.createTextNode(attributes.alt.value);

            title.setAttribute('id', uid());
            title.appendChild(titvarext);
            inlinedSVG.insertBefore(title, inlinedSVG.firstChild);

            if (attributes.id) {
              inlinedSVG.setAttribute('aria-labelledby', attributes.id.value);
            } else if (!attributes.id) {
              var getTitleId = function () {
                if (inlinedSVG.getElementsByTagName('title').length > 0) {
                  var titleId = inlinedSVG.getElementsByTagName('title')[0].getAttribute('id');
                  return titleId;
                } else {
                  return '';
                }
              };

              inlinedSVG.setAttribute('aria-labelledby', getTitleId());
            }
          }

          if (!attributes.alt) {
            inlinedSVG.setAttribute('aria-hidden', 'true');
            inlinedSVG.setAttribute('role', 'presentation');
          }

          // Use the `longdesc` attribute if one exists
          if (attributes.longdesc) {
            var description = document.createElementNS('http://www.w3.org/2000/svg', 'desc'),
              descriptionText = document.createTextNode(attributes.longdesc.value);

            description.setAttribute('id', uid());
            description.appendChild(descriptionText);
            if (attributes.alt) {
              inlinedSVG.insertBefore(description, inlinedSVG.firstChild.nextSibling);
            } else {
              inlinedSVG.insertBefore(description, inlinedSVG.firstChild);
            }

            var getDescId = function () {
              if (inlinedSVG.getElementsByTagName('desc').length > 0) {
                var descId = inlinedSVG.getElementsByTagName('desc')[0].getAttribute('id');
                return descId;
              } else {
                return '';
              }
            };

            if (attributes.alt) {
              var currAttrs = inlinedSVG.getAttribute('aria-labelledby');
              inlinedSVG.setAttribute('aria-labelledby', (currAttrs += ' ' + getDescId()));
            } else {
              inlinedSVG.setAttribute('aria-labelledby', getDescId());
            }
          }

          // Replace the image with the SVG
          if (svg.parentNode) {
            svg.parentNode.replaceChild(inlinedSVG, svg);
          }

          // Fire the callback
          if (callback) {
            callback(settings.svgSelector);
          }
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
    inliner(callback || function () {});

    // Once inlined and a class to the HTML
    document.documentElement.className += ' ' + settings.initClass;
  };

  return inlineSVG;
});
