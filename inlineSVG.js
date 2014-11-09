function inlineSVG() {
  // grab all svgs
  var svgs = document.querySelectorAll('img.svg');

  // loop through all the svgs
  for (i = 0; i < svgs.length; i++) {

    // store a couple of useful variables
    var img = svgs[i],
        imgID = svgs[i].id,
        imgClass = svgs[i].className,
        imgUrl = svgs[i].src,
        imgAlt = svgs[i].alt,
        imgWidth = svgs[i].width,
        imgHeight = svgs[i].height;

    // let's now grab the contents of the svg
    // for some reason, this doesn't feel very efficient
    var svg = new XMLHttpRequest();
    svg.open("GET", imgUrl, false);
    svg.send();

    // we're returning as XML so we can manipulate it below
    var svgResult = svg.responseXML;

    // just grab everything inside the <svg> tag
    var theSVG = svgResult.getElementsByTagName('svg')[0];

    // copy any ids to the <svg>
    if(typeof imgID !== 'undefined') {
      theSVG.setAttribute('id', imgID);
    }

    // copy any classes to the <svg>
    if(typeof imgClass !== 'undefined') {
      theSVG.setAttribute('class', imgClass + ' replaced-svg');
    }

    // remove some junk
    theSVG.removeAttribute('xmlns:a');
    theSVG.removeAttribute('width');
    theSVG.removeAttribute('height');
    theSVG.removeAttribute('x');
    theSVG.removeAttribute('y');
    theSVG.removeAttribute('enable-background');
    theSVG.removeAttribute('xmlns:xlink');
    theSVG.removeAttribute('xml:space');
    theSVG.removeAttribute('version');

    // add some attributes
    theSVG.setAttribute('aria-label', imgAlt);
    theSVG.setAttribute('height', imgHeight);
    theSVG.setAttribute('width', imgWidth);

    // replace the image with the final <svg>
    img.parentNode.replaceChild(theSVG, img);
  }
}
