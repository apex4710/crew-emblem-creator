//  Kuzey Beytar @ https://stackoverflow.com/questions/22868475/how-can-i-trim-the-length-of-a-filename-in-javascript-but-keep-the-extension
function fileTrunc(fileName) {
  if (fileName.length > 20)
    return fileName.substr(0, 10) + "[..]" + fileName.substr(-10);
  return fileName;
}

//  Elias Zamaria @ https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

//  Round float values to the given decimal place.
function floatRound(value, decimals = 5) {
  var _n = parseFloat(value).toFixed(decimals);
  return Number(_n);
}

//  Tim Down @ https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
  var _hex = c.toString(16);
  return _hex.length == 1 ? "0" + _hex : _hex;
}
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

//  discuss at: https://locutus.io/php/base_convert/
//  original by: Philippe Baumann
//  improved by: Rafał Kukawski (https://blog.kukawski.pl)
//  example 1: base_convert('A37334', 16, 2)
//  returns 1: '101000110111001100110100'
function base_convert(number, frombase, tobase) {
  return parseInt(number + "", frombase | 0).toString(tobase | 0);
}

//  Adapted from: https://stackoverflow.com/questions/25607844/css-hex-to-shorthand-hex-conversion
function hexToShort(hex) {
  if (hex[0] == "#") hex = hex.substr(1, 6);

  if (hex.length == 3) return hex;

  if (hex.length != 6) return "#FFF";

  var _final = "";

  var _segments = [];
  _segments[0] = hex.substr(0, 2);
  _segments[1] = hex.substr(2, 2);
  _segments[2] = hex.substr(4, 2);

  for (const s of _segments) {
    var _dec = base_convert(s, 16, 10);
    var _remainder = _dec % 17;
    var _newa = _dec % 17 > 7 ? 17 + (_dec - _remainder) : _dec - _remainder;
    hex = base_convert(_newa, 10, 16);
    _final += hex[0];
  }
  return "#" + _final;
}

//  Array comparison.
function arraysEqual(a, b) {
  return JSON.stringify(a) == JSON.stringify(b);
}

//  https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
function copyToClipboard(textArea, alert = false) {
  var _copyText = document.getElementById(textArea);
  var _textLength = _copyText.value.length;
  _copyText.select();
  _copyText.setSelectionRange(0, _textLength);
  navigator.clipboard.writeText(_copyText.value);
  if (alert) alert("Copied!");
}

/*  Jason J. Nathan @ https://stackoverflow.com/questions/3971841/how-to-resize-images-proportionally-keeping-the-aspect-ratio
 *  Conserve aspect ratio of the original region. Useful when shrinking/enlarging
 *  images to fit into a certain area.
 *  @param {Number} srcWidth width of source image
 *  @param {Number} srcHeight height of source image
 *  @param {Number} maxWidth maximum available width
 *  @param {Number} maxHeight maximum available height
 *  @return {Object} { width, height }
 */
//  Added offsets for square image centering.
function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return {
    width: srcWidth * ratio,
    height: srcHeight * ratio,
    offsetX: (maxWidth - srcWidth * ratio) / 2,
    offsetY: (maxHeight - srcHeight * ratio) / 2,
  };
}

//  CSS helper functions.
function setClass(element, cssClass) {
  document.getElementById(element).className = cssClass;
}
function enableElement(element) {
  document.getElementById(element).disabled = false;
}
function disableElement(element) {
  document.getElementById(element).disabled = true;
}

//  Adapted from: Gumape & Tobias Tengler @ https://stackoverflow.com/questions/3492322/javascript-createelementns-and-svg
class svgObject {
  xmlns;
  canvasWidth;
  canvasHeight;
  svgElement;
  svgDefs;
  paths;
  shapePath;

  //  Create the SVG element with the standard attributes.
  constructor(shapePath, canvasWidth = 512, canvasHeight = 512) {
    this.xmlns = "http://www.w3.org/2000/svg"; // Correct namespace
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.svgElement = document.createElementNS(this.xmlns, "svg");
    this.svgElement.setAttribute("xmlns", this.xmlns);
    this.svgElement.setAttribute("width", canvasWidth);
    this.svgElement.setAttribute("height", canvasHeight);
    this.svgElement.setAttribute("version", "1.1");
    this.svgDefs = document.createElementNS(this.xmlns, "defs");
    this.paths = [];
    this.shapePath = shapePath;
  }

  //  Add the standard background rectangle.
  addBackground() {
    var _rect = document.createElementNS(this.xmlns, "rect");
    _rect.setAttribute("x", 0);
    _rect.setAttribute("y", 0);
    _rect.setAttribute("width", this.canvasWidth);
    _rect.setAttribute("height", this.canvasHeight);
    _rect.setAttribute("rx", 0);
    _rect.setAttribute("ry", 0);
    _rect.setAttribute("fill", "none");
    _rect.setAttribute("stroke", "#a1a1a1");
    _rect.setAttribute("fill-opacity", 1);
    _rect.setAttribute("stroke-opacity", 0);
    _rect.setAttribute("stroke-width", 0);
    _rect.setAttribute("stroke-miterlimit", 10);
    this.svgElement.appendChild(_rect);
  }

  //  Add a solid layer with only one colour.
  addSolidPath(x, y, scaleX, scaleY, fill, opacity) {
    var _path = document.createElementNS(this.xmlns, "path");
    _path.setAttribute("fill", fill);
    var _alpha = floatRound((1 / 255) * opacity, 3);
    //  The alpha value only needs to be set if it is less than 1.
    if (_alpha < 1) _path.setAttribute("fill-opacity", _alpha);
    _path.setAttribute("d", this.shapePath);
    _path.setAttribute(
      "transform",
      "matrix(" + scaleX + ",0,0," + scaleY + "," + x + "," + y + ")"
    );
    this.paths.push(_path);
  }

  //  Add a gradient layer with the given gradient.
  addGradientPath(x, y, scaleX, scaleY, fill) {
    var _path = document.createElementNS(this.xmlns, "path");
    _path.setAttribute("fill", fill);
    _path.setAttribute("d", this.shapePath);
    _path.setAttribute(
      "transform",
      "matrix(" + scaleX + ",0,0," + scaleY + "," + x + "," + y + ")"
    );
    this.paths.push(_path);
  }

  //  Add a new gradient definition to the SVG.
  addGradient(id, stops, isRows) {
    var _gradient = document.createElementNS(this.xmlns, "linearGradient");
    _gradient.setAttribute("id", id);

    //  Gradient orientation (horizontal/vertical).
    if (isRows) {
      //  Horizontal gradient is the default so these attributes can be omitted.
      //_gradient.setAttribute('x2', 1);
      //_gradient.setAttribute('y2', 0);
    } else {
      _gradient.setAttribute("x2", 0);
      _gradient.setAttribute("y2", 1);
    }

    //  Add the stops to the gradient.
    for (const _stop of stops) {
      var _s = document.createElementNS(this.xmlns, "stop");

      _s.setAttribute("offset", _stop[0]);
      _s.setAttribute("stop-color", _stop[1]);

      var _alpha = floatRound((1 / 255) * _stop[2], 3);

      //  The alpha value only needs to be set if it is less than 1.
      if (_alpha < 1) _s.setAttribute("stop-opacity", _alpha);

      _gradient.appendChild(_s);
    }

    this.svgDefs.appendChild(_gradient);
  }

  //  Construct the final SVG.
  finalise() {
    this.svgElement.appendChild(this.svgDefs); //: Gradient definitions.
    this.addBackground(); //: Default background.
    for (const _path of this.paths) {
      //: Paths for each slice/layer.
      this.svgElement.appendChild(_path);
    }
  }

  // Return the full SVG element.
  getSVG() {
    return this.svgElement;
  }
}

class emblemSlice {
  constructor(
    id,
    isVisible,
    stops,
    span = 1,
    isSpanned = false,
    spannedBy = null
  ) {
    this.id = id; //: The slice ID.
    this.isVisible = isVisible; //: Is any part of the slice visible?
    this.stops = stops; //: The stops in the slice (the points where colours start/stop)
    this.span = span; //: The amount of slices that this slice spans.
    this.isSpanned = isSpanned; //: Is this slice spanned by a previous slice?
    this.spannedBy = spannedBy; //: The slice that spans this slice, if this slice is spanned.
  }
}

//  The main Emblem Helper object class.
class emblemHelper {
  svg; //: The SVG object that will be created from the source image.
  layers; //: The layers that will be uploaded to the editor.
  indexCount; //: Index for layer count.

  slug = "rectangles/21"; //: This slug was chosen as it is the smallest rectangle in size (in bytes).
  slugName = "21"; //: The name of the slug in the editor.
  slugWidth = 66.47; //: The width of the slug in the editor.
  slugHeight = 300; //: The height of the slug in the editor.
  slugPath =
    "M0,0H66.437V300H0V148.125C0,148.125,0.04,147.744,0,147.625C-0.063,147.437,0,147.062,0,147.062V0Z"; //: The slug path from the editor.

  decimalPrecision; //: The number of decimal places to round floats to.
  lowColourMode; //: Low colour mode reduces image quality but also reduces the request size.
  smoothing; //: Turn smoothing on or off for image resizing.

  sourceImage; //: The image uploaded by the user.
  sourceWidth; //: The width of the uploaded image.
  sourceHeight; //: The height of the uploaded image.

  canvas; //: Used for drawing the image in the background.
  context; //: Used for drawing the image in the background.

  emblemWidth = 512; //: Standard emblem width.
  emblemHeight = 512; //: Standard emblem height.

  sliceWidth; //: The initial slice width, prior to any scaling/spanning.
  sliceHeight; //: The initial slice height, prior to any scaling/spanning.
  gradStopSize; //: The base distance between each gradient stop point (the size of the simulated pixels).

  scaleX; //: The horizontal scaling to be applied to the slug/layer.
  scaleY; //: The vertical scaling to be applied to the slug/layer.

  layerLength; //: The size of the JSON layer data.
  svgLength; //: The size of the SVG element.
  encodedLength; //: The total size when encoded.
  maxEncodedLength; //: The maximum request size that will be accepted by the server.

  constructor() {
    this.reset();
    this.decimalPrecision = 5;
    this.lowColourMode = false;
    this.smoothing = false;
    this.maxEncodedLength = 128 * 10000;
  }

  reset() {
    this.svg = new svgObject(this.slugPath); //: Create a new SVG.
    this.indexCount = 0; //: Reset the index count for the layers.
    this.layers = []; //: Create the array to store the layers.
    //  Add the default background layer (with transparent fix).
    this.layers.push({
      id: "background",
      name: "Background",
      type: "square",
      y: 0,
      x: 0,
      scaleY: 100,
      scaleX: 100,
      invertedY: false,
      invertedX: false,
      rotation: 0,
      opacity: 100,
      index: 0,
      color: "#transparent",
      isFilled: true,
      internal: true,
      locked: false,
      tBold: false,
      tItalic: false,
      fontFamily: null,
      borderColor: "#a1a1a1",
      borderSize: 0,
      gradientStyle: "Fill",
      slug: "rectangles/square",
      width: 512,
      height: 512,
    });
  }

  //  Set the number of decimals to round SVG elements to.
  setAccuracy(i) {
    this.decimalPrecision = parseInt(i);
  }

  //  Enable or disable image smoothing.
  useSmoothing(mode) {
    this.smoothing = mode;
  }

  //  Enable or disable low colour mode.
  useLowColour(mode) {
    this.lowColourMode = mode;
  }

  //  Process the image and create the emblem.
  createEmblem(imageSrc, isRows = true, sourceCanvasSize = 256) {
    this.reset();

    var _sizeX = sourceCanvasSize,
      _sizeY = sourceCanvasSize;
    var _offsetX = 0,
      _offsetY = 0;

    //  Import the uploaded image.
    this.sourceImage = new Image();
    this.sourceImage.src = imageSrc;

    //  Calculate the size and offsets.
    var _sizes = calculateAspectRatioFit(
      this.sourceImage.width,
      this.sourceImage.height,
      sourceCanvasSize,
      sourceCanvasSize
    );
    _offsetX = _sizes.offsetX;
    _offsetY = _sizes.offsetY;
    _sizeX = _sizes.width;
    _sizeY = _sizes.height;

    this.sourceWidth = sourceCanvasSize;
    this.sourceHeight = sourceCanvasSize;

    //  Create a canvas for drawing the image.
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.sourceWidth;
    this.canvas.height = this.sourceHeight;
    this.context = this.canvas.getContext("2d");

    //  Image resize smoothing.
    if (!this.smoothing) {
      this.context.webkitImageSmoothingEnabled = false;
      this.context.mozImageSmoothingEnabled = false;
      this.context.imageSmoothingEnabled = false;
    }

    //  Draw the image to the canvas.
    this.context.drawImage(
      this.sourceImage,
      _offsetX,
      _offsetY,
      _sizeX,
      _sizeY
    );

    //  Set the scale and sizing depending on the orientation of the emblem slices.
    if (isRows) {
      this.sliceWidth = this.emblemWidth;
      this.sliceHeight = this.emblemHeight / this.sourceHeight;
      this.gradStopSize = 1 / this.sourceWidth;
      this.scaleX = this.emblemWidth / this.slugWidth;
      this.scaleY = this.emblemHeight / this.sourceHeight / this.slugHeight;

      this.createEmblemRows();
    } else {
      this.sliceWidth = this.emblemWidth / this.sourceWidth;
      this.sliceHeight = this.emblemHeight;
      this.gradStopSize = 1 / this.sourceHeight;
      this.scaleX = this.emblemWidth / this.sourceWidth / this.slugWidth;
      this.scaleY = this.emblemHeight / this.slugHeight;

      this.createEmblemColumns();
    }

    this.svg.finalise();

    //  Calculate the request size.
    var _svgElement = this.svg.getSVG().outerHTML;
    this.svgLength = _svgElement.length;
    this.layerLength = JSON.stringify(this.layers).length;
    this.encodedLength = Math.ceil((this.svgLength + this.layerLength) / 3) * 4; //: There is a bug which sometimes makes this calculation 4 bytes off from the true size.
  }

  //  Find the pixel value at the x,y coordinates of the source image.
  getPixel(x, y) {
    return this.context.getImageData(x, y, 1, 1).data;
  }

  //  Create a unique path ID.
  createPathID(i) {
    //  Note: Can this be shorter?
    var _dateTime = new Date().getTime();
    var _id = _dateTime + "" + i;
    return "s" + _id;
  }

  //  Create a new layer.
  createNewLayer(x, y, index, fill, isRows) {
    if (isRows) {
      var _y = y * this.sliceHeight - (this.slugHeight - this.sliceHeight) / 2;
      var _x = x - (this.slugWidth - this.sliceWidth) / 2;
    } else {
      var _y = y - (this.slugHeight - this.sliceHeight) / 2;
      var _x = x * this.sliceWidth - (this.slugWidth - this.sliceWidth) / 2;
    }

    _y = floatRound(_y, this.decimalPrecision);
    _x = floatRound(_x, this.decimalPrecision);

    var _scaleY = floatRound(this.scaleY * 100, this.decimalPrecision);
    var _scaleX = floatRound(this.scaleX * 100, this.decimalPrecision);

    //  Minimum layer scale in the crew emblem editor appears to be 1.
    if (_scaleX < 1) _scaleX = 1;
    if (_scaleY < 1) _scaleY = 1;

    var _id = this.createPathID(index);

    let _layer = {
      id: _id,
      name: this.slugName,
      type: "path",
      y: _y,
      x: _x,
      scaleY: _scaleY,
      scaleX: _scaleX,
      invertedY: 0, //: false   (save some bytes)
      invertedX: 0, //: false
      rotation: 0,
      opacity: 100,
      index: index,
      color: fill,
      isFilled: 1, //: true
      internal: 0, //: false
      locked: 0, //: false
      tBold: 0, //: false
      tItalic: 0, //: false
      fontFamily: null,
      borderColor: "#0", //: #0 is accepted as a colour but is the same as 'none'.
      borderSize: 0,
      gradientStyle: "Fill",
      slug: this.slug,
      width: this.slugWidth,
      height: this.slugHeight,
    };

    return _layer;
  }

  //  Loop through the image and create slices.
  createEmblemColumns() {
    let _slices = [];

    for (let x = 0; x < this.sourceWidth; x++) {
      let _gradientId = x; //: Short gradient name.
      let _stops = [];

      let _hasVisiblePixels = false; //: Track if any part of the slice is visible.

      for (let y = 0; y < this.sourceHeight; y++) {
        let _color = this.getPixel(x, y);
        let _colorNext = this.getPixel(x, y + 1);
        let _colorPrev = this.getPixel(x, y - 1);

        let _colorHex = rgbToHex(_color[0], _color[1], _color[2]);
        let _colorNextHex = rgbToHex(
          _colorNext[0],
          _colorNext[1],
          _colorNext[2]
        );
        let _colorPrevHex = rgbToHex(
          _colorPrev[0],
          _colorPrev[1],
          _colorPrev[2]
        );

        if (this.lowColourMode) {
          _colorHex = hexToShort(_colorHex);
          _colorNextHex = hexToShort(_colorNextHex);
          _colorPrevHex = hexToShort(_colorPrevHex);
        }

        //  Track if the current slice contains any visible pixels.
        if (_color[3] > 0 && _hasVisiblePixels == false)
          _hasVisiblePixels = true;

        //  Add a new gradient stop (end the current colour) if:
        if (
          (_colorHex != _colorPrevHex ||
            (_colorHex == _colorPrevHex && _color[3] != _colorPrev[3])) &&
          y != 0 &&
          y != this.sourceHeight
        ) {
          let _offsetA = floatRound(
            (y - 1) * this.gradStopSize + this.gradStopSize,
            this.decimalPrecision
          );
          if (_offsetA > 1) _offsetA = 1;
          _stops.push([_offsetA, _colorHex, _color[3]]);
        }

        //  Add a new gradient stop (start the next colour) if:
        if (
          _colorHex != _colorNextHex ||
          (_colorHex == _colorNextHex && _color[3] != _colorNext[3])
        ) {
          let _offsetB = floatRound(
            y * this.gradStopSize + this.gradStopSize,
            this.decimalPrecision
          );
          if (_offsetB > 1) _offsetB = 1;
          _stops.push([_offsetB, _colorHex, _color[3]]);
        }
      }

      //  If the current slice is the same as the previous one, extend the previous slice instead of creating a new one.
      if (
        x > 0 &&
        x < this.sourceWidth &&
        arraysEqual(_stops, _slices[x - 1].stops)
      ) {
        if (_slices[x - 1].isSpanned) {
          let _originator = _slices[x - 1].spannedBy;
          _slices[x] = new emblemSlice(
            x,
            _hasVisiblePixels,
            _stops,
            1,
            true,
            _originator
          );
          _slices[_originator].span += 1;
        } else {
          _slices[x] = new emblemSlice(
            x,
            _hasVisiblePixels,
            _stops,
            1,
            true,
            x - 1
          );
          _slices[x - 1].span += 1;
        }
      } else {
        _slices[x] = new emblemSlice(x, _hasVisiblePixels, _stops, 1);
      }
    }

    //  Loop through all the slices and create SVG elements for the visible ones.
    for (const _slice of _slices) {
      if (_slice.isVisible && !_slice.isSpanned) {
        if (_slice.stops.length == 1) {
          let _hex = _slice.stops[0][1];
          let _alpha = _slice.stops[0][2];
          this.svg.addSolidPath(
            _slice.id * this.sliceWidth,
            0,
            floatRound(this.scaleX * _slice.span, this.decimalPrecision),
            floatRound(this.scaleY, this.decimalPrecision),
            _hex,
            _alpha
          );
        } else {
          this.svg.addGradient(_slice.id, _slice.stops, false);
          let _fill = "url(#" + _slice.id + ")";
          this.svg.addGradientPath(
            _slice.id * this.sliceWidth,
            0,
            floatRound(this.scaleX * _slice.span, this.decimalPrecision),
            floatRound(this.scaleY, this.decimalPrecision),
            _fill
          );
        }
        this.layers.push(
          this.createNewLayer(_slice.id, 0, this.indexCount++, "#000", false)
        ); //: #000 could be changed to '#0' or 'red' to save a few bytes.
      }
    }
  }

  createEmblemRows() {
    let _slices = [];
    for (let y = 0; y < this.sourceHeight; y++) {
      let _gradientId = y;
      let _stops = [];
      let _hasVisiblePixels = false;

      for (let x = 0; x < this.sourceWidth; x++) {
        let _color = this.getPixel(x, y);
        let _colorNext = this.getPixel(x + 1, y);
        let _colorPrev = this.getPixel(x - 1, y);
        let _colorHex = rgbToHex(_color[0], _color[1], _color[2]);
        let _colorNextHex = rgbToHex(
          _colorNext[0],
          _colorNext[1],
          _colorNext[2]
        );
        let _colorPrevHex = rgbToHex(
          _colorPrev[0],
          _colorPrev[1],
          _colorPrev[2]
        );

        if (this.lowColourMode) {
          _colorHex = hexToShort(_colorHex);
          _colorNextHex = hexToShort(_colorNextHex);
          _colorPrevHex = hexToShort(_colorPrevHex);
        }

        if (_color[3] > 0 && _hasVisiblePixels == false)
          _hasVisiblePixels = true;

        if (
          (_colorHex != _colorPrevHex ||
            (_colorHex == _colorPrevHex && _color[3] != _colorPrev[3])) &&
          x != 0 &&
          x != this.sourceWidth
        ) {
          let _offsetA = floatRound(
            (x - 1) * this.gradStopSize + this.gradStopSize,
            this.decimalPrecision
          );
          if (_offsetA > 1) _offsetA = 1;
          _stops.push([_offsetA, _colorHex, _color[3]]);
        }

        if (
          _colorHex != _colorNextHex ||
          (_colorHex == _colorNextHex && _color[3] != _colorNext[3])
        ) {
          let _offsetB = floatRound(
            x * this.gradStopSize + this.gradStopSize,
            this.decimalPrecision
          );
          if (_offsetB > 1) _offsetB = 1;
          _stops.push([_offsetB, _colorHex, _color[3]]);
        }
      }

      if (
        y > 0 &&
        y < this.sourceHeight &&
        arraysEqual(_stops, _slices[y - 1].stops)
      ) {
        if (_slices[y - 1].isSpanned) {
          let _originator = _slices[y - 1].spannedBy;
          _slices[y] = new emblemSlice(
            y,
            _hasVisiblePixels,
            _stops,
            1,
            true,
            _originator
          );
          _slices[_originator].span += 1;
        } else {
          _slices[y] = new emblemSlice(
            y,
            _hasVisiblePixels,
            _stops,
            1,
            true,
            y - 1
          );
          _slices[y - 1].span += 1;
        }
      } else {
        _slices[y] = new emblemSlice(y, _hasVisiblePixels, _stops, 1);
      }
    }

    for (const _slice of _slices) {
      if (_slice.isVisible && !_slice.isSpanned) {
        if (_slice.stops.length == 1) {
          let _hex = _slice.stops[0][1];
          let _alpha = _slice.stops[0][2];
          this.svg.addSolidPath(
            0,
            _slice.id * this.sliceHeight,
            floatRound(this.scaleX, this.decimalPrecision),
            floatRound(this.scaleY * _slice.span, this.decimalPrecision),
            _hex,
            _alpha
          );
        } else {
          this.svg.addGradient(_slice.id, _slice.stops, true);
          let _fill = "url(#" + _slice.id + ")";
          this.svg.addGradientPath(
            0,
            _slice.id * this.sliceHeight,
            floatRound(this.scaleX, this.decimalPrecision),
            floatRound(this.scaleY * _slice.span, this.decimalPrecision),
            _fill
          );
        }
        this.layers.push(
          this.createNewLayer(0, _slice.id, this.indexCount++, "#000", true)
        );
      }
    }
  }

  getConsoleCode() {
    //  Base64 encode the SVG and layer data.
    let _svgData = btoa(this.svg.getSVG().outerHTML);
    let _layerData = btoa(JSON.stringify(this.layers));
    //  Create the request.
    let _consoleCode =
      "// Generated with EmblemHelper v2.0 modified by APEX \n\n";
    _consoleCode += 'var svgData = "' + _svgData + '";\n\n';
    _consoleCode += 'var layerData = "' + _layerData + '";\n\n';
    _consoleCode +=
      'var request = new XMLHttpRequest;request.open("POST","/emblems/save",!0),request.onreadystatechange=function(){if(request.readyState==XMLHttpRequest.DONE){var a=JSON.parse(request.responseText);200==a.Status?window.location.href="https://socialclub.rockstargames.com/emblems/edit/"+a.EmblemId:a.Message?alert(a.Message):alert(a.Error.Message)}},request.setRequestHeader("Content-Type","application/json"),request.setRequestHeader("__RequestVerificationToken",document.getElementsByName("__RequestVerificationToken")[0].value),request.setRequestHeader("X-Requested-With","XMLHttpRequest"),request.send(JSON.stringify({"crewId":"0","emblemId":"","parentId":"","svgData":svgData,"layerData": layerData,"hash":document.getElementById("editorField-hash").value}));';

    return _consoleCode;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Adapted from: https://web.dev/read-files/
  const STATUS = document.getElementById("eh-lblStatus");
  const OUTPUT = document.getElementById("eh-imgSource");

  if (window.FileList && window.File && window.FileReader) {
    document
      .getElementById("eh-fileSelector")
      .addEventListener("change", (event) => {
        OUTPUT.src = "";
        STATUS.textContent = "NO IMAGE";
        // Disable the Create Emblem button.
        setClass("eh-btnProcessImage", "btn-wide clr-inactive");
        disableElement("eh-btnProcessImage");

        const FILE = event.target.files[0];

        if (!FILE.type) {
          STATUS.textContent =
            "Error: The File.type property does not appear to be supported on this browser.";
          return;
        }

        if (!FILE.type.match("image.*")) {
          STATUS.textContent = "Error: Image format not recognized!";
          return;
        }

        const READER = new FileReader();
        READER.addEventListener("load", (event) => {
          OUTPUT.src = event.target.result;
          const _path = document.getElementById("eh-fileSelector").value;
          const _fName = _path.split("\\").pop();
          STATUS.textContent = fileTrunc(_fName);
          // Enable the Create Emblem button.
          setClass("eh-btnProcessImage", "btn-wide clr-primary");
          enableElement("eh-btnProcessImage");
        });

        // Set the initial size for the imported image.
        OUTPUT.addEventListener("load", (event) => {
          const _w = OUTPUT.naturalWidth;
          const _h = OUTPUT.naturalHeight;

          if (_w >= 512 || _h >= 512) {
            document.getElementById("eh-opt512").checked = true;
          } else if (_w >= 256 || _h >= 256) {
            document.getElementById("eh-opt256").checked = true;
          } else if (_w >= 128 || _h >= 128) {
            document.getElementById("eh-opt128").checked = true;
          } else {
            document.getElementById("eh-opt64").checked = true;
          }
        });

        READER.readAsDataURL(FILE);
      });
  }

  // Define EH in a broader scope.
  let EH;

  // Import Image button clicked: trigger the file select dialog.
  document.getElementById("eh-btnImportImage").onclick = () => {
    document.getElementById("eh-fileSelector").click();
  };

  // Create Emblem button clicked: check the selected options and process the image.
  // Create Emblem button clicked: check the selected options and process the image
  document.getElementById("eh-btnProcessImage").onclick = () => {
    console.log("Processing Emblem");

    // Disable the Create Code button
    setClass("eh-btnCreateCode", "btn-wide clr-inactive");
    disableElement("eh-btnCreateCode");

    // Disable the Copy Code button
    setClass("eh-btnCopyCode", "btn-wide clr-inactive");
    disableElement("eh-btnCopyCode");

    // Clear the console code text area
    document.getElementById("eh-txtConsoleCode").value = "";

    // Create a new Emblem Helper object
    EH = new emblemHelper();

    // Get the selected source image canvas size
    let _resize = 64;
    const _optionResize = document.getElementsByName("eh-optSourceSize");
    for (let i = 0; i < _optionResize.length; i++) {
      if (_optionResize[i].checked) _resize = Number(_optionResize[i].value);
    }

    // Get the selected decimal precision
    let _precision = 3;
    const _optionAccuracy = document.getElementsByName("eh-optAccuracy");
    for (let i = 0; i < _optionAccuracy.length; i++) {
      if (_optionAccuracy[i].checked)
        _precision = Number(_optionAccuracy[i].value);
    }

    // Set the decimal precision in the Emblem Helper object
    EH.setAccuracy(_precision);

    // Get the selected smoothing mode (on/off)
    document.getElementById("eh-optOn").checked
      ? EH.useSmoothing(true)
      : EH.useSmoothing(false);

    // Get the selected colour mode (low/full)
    document.getElementById("eh-optLow").checked
      ? EH.useLowColour(true)
      : EH.useLowColour(false);

    const _sourceImage = document.getElementById("eh-imgSource").src;

    // Create the emblem using the selected method (auto/rows/columns)
    if (document.getElementById("eh-optRows").checked) {
      EH.createEmblem(_sourceImage, true, _resize);
    } else if (document.getElementById("eh-optColumns").checked) {
      EH.createEmblem(_sourceImage, false, _resize);
    } else if (document.getElementById("eh-optAuto").checked) {
      // NOTE: Inefficient. Needs work
      EH.createEmblem(_sourceImage, false, _resize);
      const _lengthColumns = EH.encodedLength;
      EH.createEmblem(_sourceImage, true, _resize);
      const _lengthRows = EH.encodedLength;
      if (_lengthColumns < _lengthRows)
        EH.createEmblem(_sourceImage, false, _resize);
    }

    // Display the emblem SVG preview
    document.getElementById("eh-svgPreview").innerHTML = "";
    document.getElementById("eh-svgPreview").appendChild(EH.svg.getSVG());

    // Check the size of the resulting emblem
    if (EH.encodedLength < EH.maxEncodedLength) {
      // The emblem is small enough to upload
      setClass("eh-divInfo", "div-info clr-success");
      document.getElementById("eh-divInfo").innerHTML =
        "OK:&nbsp;&nbsp;&nbsp; " +
        numberWithCommas(EH.encodedLength) +
        "&nbsp;&nbsp;/&nbsp;&nbsp;" +
        numberWithCommas(EH.maxEncodedLength);
      // Enable the Create Code button
      setClass("eh-btnCreateCode", "btn-wide clr-primary");
      enableElement("eh-btnCreateCode");

      console.log(
        "Success: " + document.getElementById("eh-divInfo").className
      );
    } else {
      // The emblem is too large to upload
      setClass("eh-divInfo", "div-info clr-danger");
      document.getElementById("eh-divInfo").innerHTML =
        "Too Expensive:&nbsp;&nbsp;&nbsp; " +
        numberWithCommas(EH.encodedLength) +
        "&nbsp;&nbsp;/&nbsp;&nbsp;" +
        numberWithCommas(EH.maxEncodedLength);

      console.log("Danger: " + document.getElementById("eh-divInfo").className);
    }
  };

  // Create Code button clicked: display the console code.
  document.getElementById("eh-btnCreateCode").onclick = () => {
    document.getElementById("eh-txtConsoleCode").value = EH.getConsoleCode();
    // Enable the Copy Code button.
    setClass("eh-btnCopyCode", "btn-wide clr-primary");
    enableElement("eh-btnCopyCode");
  };

  // Copy Code button clicked: copy the code to the clipboard.
  document.getElementById("eh-btnCopyCode").onclick = () => {
    copyToClipboard("eh-txtConsoleCode");
    // Notify the user that the code was copied.
    document.getElementById("eh-btnCopyCode").innerText = "Copied";
    setClass("eh-btnCopyCode", "btn-wide clr-success");
    setTimeout(() => {
      document.getElementById("eh-btnCopyCode").innerText = "Copy Code";
      setClass("eh-btnCopyCode", "btn-wide clr-primary");
    }, 2000);
  };
});
