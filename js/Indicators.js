import { log, error, panic } from '/js/UTIL.js';

var Indicators = {};

// sizes all in pixels
Indicators.WIDTH = 200;
Indicators.HEIGHT = 50;
Indicators.X_SEPARATION = 300;
Indicators.Y_SEPARATION = 25;
Indicators.BORDER_WIDTH = 6; // black border around lights

Indicators.CSS_CENTRED_DIV = 'position:fixed; bottom:10px; width:100%';
Indicators.CSS_LIGHTS_DIV = 'margin-left:auto; margin-right:auto';

Indicators.FLICKER_FRAMES = 2; // when flickering, show each colour for this many frames
Indicators.frameCounter = null; // current flicker timer
Indicators.isRedOn = true;  // current flicker state

Indicators.lightsDiv = null; // for hide/show
Indicators.canvasContext = null; // for painting on

// on/off state of indicators
Indicators.red = false;
Indicators.yellow = false;
Indicators.blue = false;

Indicators.init = function()
{
  if (UTIL.platformSupportsTouch())
  {
    Indicators.adjustForTouch();
  }

  var centredDiv = document.createElement('div');
  centredDiv.id = 'centredLightsDiv';
  centredDiv.style.cssText = Indicators.CSS_CENTRED_DIV;
  // set the z-index for all the indicator divs in the parent div
  centredDiv.style.zIndex = Display.ZINDEX_INDICATORS;

  // figure out how big our draw area is for the lights
  var width = (Indicators.WIDTH * 2) + Indicators.X_SEPARATION;
  var height = (Indicators.HEIGHT * 3) + (Indicators.Y_SEPARATION * 2);

  Indicators.lightsDiv = document.createElement('div');
  Indicators.lightsDiv.id = 'lightsDiv';
  Indicators.lightsDiv.style.cssText = Indicators.CSS_LIGHTS_DIV;
  Indicators.lightsDiv.style.width = width + 'px';
  Indicators.lightsDiv.style.height = height + 'px';
  Indicators.lightsDiv.style.display = 'none';  // off by default until shown

  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  Indicators.lightsDiv.appendChild(canvas);
  centredDiv.appendChild(Indicators.lightsDiv);
  document.body.appendChild(centredDiv);

  Indicators.canvasContext = canvas.getContext('2d');

  Indicators.initBorders();
  Indicators.paint();
};

// just draw black rects where the lights will be
Indicators.initBorders = function()
{
  Indicators.canvasContext.fillStyle = C64.css.black;
  for (var row = 0; row <=2; row++)
  {
    // left column
    Indicators.canvasContext.fillRect(0,
      (Indicators.HEIGHT * row) + (Indicators.Y_SEPARATION * row),
      Indicators.WIDTH,
      Indicators.HEIGHT);
    // right column
    Indicators.canvasContext.fillRect(Indicators.WIDTH + Indicators.X_SEPARATION,
      (Indicators.HEIGHT * row) + (Indicators.Y_SEPARATION * row),
      Indicators.WIDTH,
      Indicators.HEIGHT);
  }
};

Indicators.adjustForTouch = function()
{
  Indicators.WIDTH = 50;
  Indicators.X_SEPARATION = 230;
};

Indicators.addToScene = function()
{
  Indicators.lightsDiv.style.display = 'block';
};

Indicators.removeFromScene = function()
{
  Indicators.lightsDiv.style.display = 'none';
};

Indicators.setYellow = function(state)
{
  Indicators.yellow = state;
  Indicators.paint();
};

Indicators.setRed = function(state)
{
  Indicators.red = state;
  Indicators.paint();
};

Indicators.setBlue = function(state)
{
  Indicators.blue = state;
  Indicators.paint();
};

// row is 0, 1, 2 for top, middle, bottom.
Indicators.paintRowWithColour = function(row, colour)
{
  Indicators.canvasContext.fillStyle = colour;
  // left column
  Indicators.canvasContext.fillRect(Indicators.BORDER_WIDTH,
    (Indicators.HEIGHT * row) + (Indicators.Y_SEPARATION * row) + Indicators.BORDER_WIDTH,
    Indicators.WIDTH - Indicators.BORDER_WIDTH * 2,
    Indicators.HEIGHT - Indicators.BORDER_WIDTH * 2);
  // right column
  Indicators.canvasContext.fillRect(Indicators.WIDTH + Indicators.X_SEPARATION + Indicators.BORDER_WIDTH,
    (Indicators.HEIGHT * row) + (Indicators.Y_SEPARATION * row) + Indicators.BORDER_WIDTH,
    Indicators.WIDTH - Indicators.BORDER_WIDTH * 2,
    Indicators.HEIGHT - Indicators.BORDER_WIDTH * 2);
};

Indicators.paintRed = function()
{
  // default state is dull red = off
  var currentRedColour = C64.css.red;

  if (Indicators.red)
  {
    // set colour according to flicker state
    currentRedColour = Indicators.isRedOn ? C64.css.lightred : C64.css.red;
    // advance the flicker state
    Indicators.frameCounter += 1;
    if (Indicators.frameCounter === Indicators.FLICKER_FRAMES)
    {
      Indicators.isRedOn = !Indicators.isRedOn;
      Indicators.frameCounter = 0;
    }
  }

  Indicators.paintRowWithColour(0, currentRedColour);
};

Indicators.paint = function()
{
  Indicators.paintRed();
  Indicators.paintRowWithColour(1, Indicators.yellow ? C64.css.yellow : C64.css.orange);
  Indicators.paintRowWithColour(2, Indicators.blue ? C64.css.lightblue : C64.css.blue);
};

Indicators.update = function()
{
  if (Indicators.red) // don't repaint unless there's some flickering work to do
  {
    Indicators.paintRed();
  }
};

Indicators.reset = function()
{
  Indicators.setRed(false);
  Indicators.setYellow(false);
  Indicators.setBlue(false);
};
