function inlineSVG() {
  // grab all svgs
  var svgs = document.querySelectorAll('img.svg'),
  i = 0;

  // loop through all the svgs
  for (i = 0; i < svgs.length; i++) {

    // store a couple of useful variables
    var img = svgs[i],
    imgID = svgs[i].id,
    imgClass = svgs[i].className,
    imgUrl = svgs[i].src,
    imgAlt = svgs[i].getAttribute('alt'),
    imgWidth = svgs[i].getAttribute('width'),
    imgHeight = svgs[i].getAttribute('height');

    // let's now grab the contents of the svg
    // for some reason, this doesn't feel very efficient
    var svg = new XMLHttpRequest();
    svg.open("GET", imgUrl, false);
    svg.send();

    // we're returning as XML so we can manipulate it below and parse it
    var svgText = svg.responseText,
    parser = new DOMParser(),
    svgResult = parser.parseFromString(svgText, "text/xml");

    // just grab everything inside the <svg> tag
    var theSVG = svgResult.getElementsByTagName('svg')[0];

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

    // copy any ids to the <svg>
    if(imgID) {
      theSVG.setAttribute('id', imgID);
    }

    // copy any classes to the <svg>
    if(imgClass) {
      theSVG.setAttribute('class', imgClass + ' replaced-svg');
    }

    // copy any widths to the <svg>
    if(imgWidth) {
      theSVG.setAttribute('width', imgWidth);
    }

    // copy any heights to the <svg>
    if(imgHeight) {
      theSVG.setAttribute('height', imgHeight);
    }

    // add an aria-labelledby, role and a title
    if(imgAlt) {
      theSVG.setAttribute('aria-labelledby', 'title');
      theSVG.setAttribute('role', 'img');

      // add a title
      var titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      var titleContent = document.createTextNode(imgAlt);
      titleElement.appendChild(titleContent);
      theSVG.insertBefore(titleElement, theSVG.firstChild);
    }

    // replace the image with the final <svg>
    img.parentNode.replaceChild(theSVG, img);
  }
}
