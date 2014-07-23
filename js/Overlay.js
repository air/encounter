'use strict';

var Overlay = {};

Overlay.containerDiv = null;

Overlay.text = null; // current text in readout

Overlay.init = function()
{
  Overlay.initDivs();
};

Overlay.initDivs = function()
{
  // the overlay div will contain a line of text, containing world number and enemy count
  Overlay.containerDiv = document.createElement('div');
  Overlay.containerDiv.id = 'overlay';
  Overlay.containerDiv.style.cssText = 'opacity:0.5';
  Overlay.containerDiv.style.display = 'none'; // off by default until shown

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
    case State.ATTRACT:
      Overlay.text.innerHTML = 'PRESS FIRE TO BEGIN'; // FIXME no longer shown
      break;
    case State.COMBAT:
    case State.WAIT_FOR_ENEMY:
    case State.WAIT_FOR_PORTAL:
      // TODO Player.livesLeft
      Overlay.text.innerHTML = 'L' + Level.number + ' E' + State.enemiesRemaining;
      break;
    default:
      console.error('unknown state: ', State.current);
  }
};

Overlay.removeFromScene = function()
{
  Overlay.containerDiv.style.display = 'none';
};

Overlay.addToScene = function()
{
  Overlay.containerDiv.style.display = 'block';
};