  'use strict';

var Overlay = {};

Overlay.ZINDEX_SKY = '1';
Overlay.ZINDEX_HORIZON = '2';
Overlay.ZINDEX_CANVAS = '3';
Overlay.ZINDEX_RADAR = '4';
Overlay.ZINDEX_INDICATORS = '5';
Overlay.ZINDEX_CROSSHAIRS = '6';
Overlay.ZINDEX_TEXT = '7';

Overlay.CROSSHAIR_WIDTH = 80;
Overlay.CROSSHAIR_HEIGHT = 60;
Overlay.CROSSHAIR_THICKNESS = 7;

Overlay.containerDiv = null;
Overlay.horizonDiv = null;
Overlay.aimDiv = null;
Overlay.skyDiv = null;

Overlay.text = null; // current text in readout

Overlay.init = function()
{
  Overlay.initDivs();
  Overlay.initHorizon();
  Overlay.initCrosshairs();
  Overlay.initSky();
};

Overlay.initSky = function()
{
  Overlay.skyDiv = document.createElement('div');
  Overlay.skyDiv.id = 'sky';
  Overlay.skyDiv.style.backgroundColor = C64.css.lightblue;
  Overlay.skyDiv.style.position = 'absolute';
  Overlay.skyDiv.style.width = '100%';
  Overlay.skyDiv.style.height = '100%';
  Overlay.skyDiv.style.zIndex = Overlay.ZINDEX_SKY;
  Overlay.skyDiv.style.display = 'none'; // off by default until shown
  document.body.appendChild(Overlay.skyDiv);
};

Overlay.initHorizon = function()
{
  Overlay.horizonDiv = document.createElement('div');
  Overlay.horizonDiv.id = 'horizon';
  Overlay.horizonDiv.style.cssText = 'width=100%; height:4px; position:absolute; top:0; bottom:0; left:0; right:0; margin:auto;';
  Overlay.horizonDiv.style.transform = 'translateY(2px)';
  Overlay.horizonDiv.style.zIndex = Overlay.ZINDEX_HORIZON;
  Overlay.horizonDiv.style.display = 'none'; // off by default until shown
  document.body.appendChild(Overlay.horizonDiv);
};

Overlay.initCrosshairs = function()
{
  Overlay.aimDiv = document.createElement('canvas');
  Overlay.aimDiv.id = 'crosshairs';
  // don't use CSS to set the size of a canvas, or you'll get scaling. Set direct on the element.
  Overlay.aimDiv.width = Overlay.CROSSHAIR_WIDTH;
  Overlay.aimDiv.height = Overlay.CROSSHAIR_HEIGHT;
  Overlay.aimDiv.style.cssText = 'position:absolute; top:0; bottom:0; left:0; right:0; margin:auto;';
  Overlay.aimDiv.style.zIndex = Overlay.ZINDEX_CROSSHAIRS;
  Overlay.aimDiv.style.display = 'none'; // off by default until shown

  // draw the crosshairs
  var canvas = Overlay.aimDiv.getContext('2d');
  canvas.fillStyle = C64.css.lightgrey;
  var serifLength = Overlay.CROSSHAIR_WIDTH / 5;
  // left
  canvas.fillRect(0, 0, serifLength, Overlay.CROSSHAIR_THICKNESS);
  canvas.fillRect(0, 0, Overlay.CROSSHAIR_THICKNESS, Overlay.CROSSHAIR_HEIGHT);
  canvas.fillRect(0, Overlay.CROSSHAIR_HEIGHT - Overlay.CROSSHAIR_THICKNESS, serifLength, Overlay.CROSSHAIR_THICKNESS);
  // right
  canvas.fillRect(Overlay.CROSSHAIR_WIDTH - serifLength, 0, serifLength, Overlay.CROSSHAIR_THICKNESS);
  canvas.fillRect(Overlay.CROSSHAIR_WIDTH - Overlay.CROSSHAIR_THICKNESS, 0, Overlay.CROSSHAIR_THICKNESS, Overlay.CROSSHAIR_HEIGHT);
  canvas.fillRect(Overlay.CROSSHAIR_WIDTH - serifLength, Overlay.CROSSHAIR_HEIGHT - Overlay.CROSSHAIR_THICKNESS, serifLength, Overlay.CROSSHAIR_THICKNESS);

  document.body.appendChild(Overlay.aimDiv);
};

Overlay.initDivs = function()
{
  // the overlay div will contain a line of text, containing world number and enemy count
  Overlay.containerDiv = document.createElement('div');
  Overlay.containerDiv.id = 'overlay';
  Overlay.containerDiv.style.cssText = 'background-color:#000;';
  Overlay.containerDiv.style.display = 'none'; // off by default until shown
  Overlay.containerDiv.style.zIndex = Overlay.ZINDEX_TEXT;

  // textBox adds padding, alignment, background
  var textBox = document.createElement('div');
  textBox.id = 'textBox';
  // padding order: top right bottom left
  // TODO gradient needs multiple declarations to work in all browsers, as per stats.js/examples/theming.html
  textBox.style.cssText = 'padding:0px 5px 0px 5px; text-align:left; background-color:#000; background-image:-webkit-linear-gradient(top, rgba(255,255,255,.4) 0%, rgba(0,0,0,.35) 100%)';
  Overlay.containerDiv.appendChild(textBox);

  // text is the content
  Overlay.text = document.createElement('div');
  Overlay.text.id = 'text';
  Overlay.text.style.cssText = 'color:#0ff; font-family:Helvetica,Arial,sans-serif; font-size:36px; font-weight:bold; /* line-height:18px */';
  textBox.appendChild(Overlay.text);

  // place the overlay in the page
  Overlay.containerDiv.style.position = 'absolute';
  Overlay.containerDiv.style.top = '0px';
  document.body.appendChild(Overlay.containerDiv);
};

Overlay.update = function()
{
  switch (State.current)
  {
    case State.COMBAT:
    case State.WAIT_FOR_ENEMY:
    case State.WAIT_FOR_PORTAL:
      Overlay.text.innerHTML = 'L' + Level.number + ' E' + State.enemiesRemaining + ' S' + Player.shieldsLeft;
      break;
    default:
      console.error('unknown state: ', State.current);
  }
};

Overlay.removeFromScene = function()
{
  Overlay.containerDiv.style.display = 'none';
  Overlay.horizonDiv.style.display = 'none';
  Overlay.aimDiv.style.display = 'none';
  Overlay.skyDiv.style.display = 'none';
};

Overlay.addToScene = function()
{
  Overlay.containerDiv.style.display = 'block';
  Overlay.horizonDiv.style.display = 'block';
  Overlay.aimDiv.style.display = 'block';
  Overlay.skyDiv.style.display = 'block';
};

Overlay.setSkyColour = function(cssColour)
{
  Overlay.skyDiv.style.backgroundColor = cssColour;
};

Overlay.setHorizonColour = function(cssColour)
{
  Overlay.horizonDiv.style.backgroundColor = cssColour;
};
