'use strict';

var Indicators = {};

Indicators.WIDTH = 200;
Indicators.HEIGHT = 50;
Indicators.X_SEPARATION = 300;
Indicators.Y_SEPARATION = 25;

Indicators.CSS_CENTRED_DIV = 'position:fixed; bottom:10px; width:100%';
Indicators.CSS_LIGHTS_DIV = 'margin-left:auto; margin-right:auto';

Indicators.FLICKER_FRAMES = 2; // when flickering, show each colour for this many frames
Indicators.frameCounter = null; // current flicker timer
Indicators.isRedOn = true;  // current flicker state

Indicators.lightsDiv = null; // for hide/show
Indicators.canvasContext = null; // for painting on

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

  // figure out how big our draw area is for the lights
  var width = (Indicators.WIDTH * 2) + Indicators.X_SEPARATION;
  var height = (Indicators.HEIGHT * 3) + (Indicators.Y_SEPARATION * 2);

  Indicators.lightsDiv = document.createElement('div');
  Indicators.lightsDiv.id = 'lightsDiv';
  Indicators.lightsDiv.style.cssText = Indicators.CSS_LIGHTS_DIV;
  Indicators.lightsDiv.style.width = width + 'px'; 
  Indicators.lightsDiv.style.height = height + 'px';

  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  Indicators.lightsDiv.appendChild(canvas);
  centredDiv.appendChild(Indicators.lightsDiv);
  document.body.appendChild(centredDiv);

  Indicators.canvasContext = canvas.getContext('2d');

  Indicators.paint();
}

Indicators.adjustForTouch = function()
{
  Indicators.WIDTH = 50;
  Indicators.X_SEPARATION = 230;
}

Indicators.addToScene = function()
{
  Indicators.lightsDiv.style.display = 'block';
}

Indicators.removeFromScene = function()
{
  Indicators.lightsDiv.style.display = 'none';
}

Indicators.setYellow = function(state)
{
  Indicators.yellow = state;
  Indicators.paint();
}

Indicators.setRed = function(state)
{
  Indicators.red = state;
  Indicators.paint();
}

Indicators.setBlue = function(state)
{
  Indicators.blue = state;
  Indicators.paint();
}

Indicators.paintRed = function()
{
  if (Indicators.red)
  {
    Indicators.canvasContext.fillStyle = Indicators.isRedOn ? C64.css.lightred : C64.css.red;
    Indicators.frameCounter += 1;
    if (Indicators.frameCounter === Indicators.FLICKER_FRAMES)
    {
      Indicators.isRedOn = !Indicators.isRedOn;
      Indicators.frameCounter = 0;
    }
  }
  else
  {
    Indicators.canvasContext.fillStyle = C64.css.red;
  }

  Indicators.canvasContext.fillRect(0, 0, Indicators.WIDTH, Indicators.HEIGHT);
  Indicators.canvasContext.fillRect(Indicators.WIDTH + Indicators.X_SEPARATION, 0, Indicators.WIDTH, Indicators.HEIGHT);
}

Indicators.paint = function()
{
  Indicators.paintRed();

  Indicators.canvasContext.fillStyle = Indicators.yellow ? C64.css.yellow : C64.css.orange;
  Indicators.canvasContext.fillRect(0, Indicators.HEIGHT + Indicators.Y_SEPARATION, Indicators.WIDTH, Indicators.HEIGHT);
  Indicators.canvasContext.fillRect(Indicators.WIDTH + Indicators.X_SEPARATION, Indicators.HEIGHT + Indicators.Y_SEPARATION, Indicators.WIDTH, Indicators.HEIGHT);

  Indicators.canvasContext.fillStyle = Indicators.blue ? C64.css.lightblue : C64.css.blue;
  Indicators.canvasContext.fillRect(0, Indicators.HEIGHT*2 + Indicators.Y_SEPARATION*2, Indicators.WIDTH, Indicators.HEIGHT);
  Indicators.canvasContext.fillRect(Indicators.WIDTH + Indicators.X_SEPARATION, Indicators.HEIGHT*2 + Indicators.Y_SEPARATION*2, Indicators.WIDTH, Indicators.HEIGHT);
}

Indicators.update = function()
{
  if (Indicators.red) // don't repaint unless there's some flickering work to do
  {
    Indicators.paintRed();
  }
}