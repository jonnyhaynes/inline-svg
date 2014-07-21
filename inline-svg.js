function inlineSVG() {
  $('img.svg').not('.replaced-svg').each(function() {
    var theIMG = jQuery(this), imgID = theIMG.attr('id'), imgClass = theIMG.attr('class'), imgURL = theIMG.attr('src'), imgAlt = theIMG.attr('alt');

    $.get(imgURL, function(data) {
      // Get the SVG tag, ignore the rest of the crap spat out by Illustrator
      var theSVG = $(data).find('svg');

      // Copy image's ID to the new SVG
      if(typeof imgID !== 'undefined') {
        theSVG = theSVG.attr('id', imgID);
      }
      // Copy image's classes to the new SVG
      if(typeof imgClass !== 'undefined') {
        theSVG = theSVG.attr('class', imgClass + ' replaced-svg');
      }

      // Remove any invalid XML tags as per http://validator.w3.org and add in aria-label and title based on image alt for accessibility
      theSVG = theSVG.removeAttr('xmlns:a width height x y enable-background xmlns:xlink xml:space').attr('aria-label', imgAlt).prepend('<title>' + imgAlt + '</title>');

      // Replace image with new SVG
      theIMG.replaceWith(theSVG);
    });
  });
}
