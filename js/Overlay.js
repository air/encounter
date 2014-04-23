var Overlay = {};

Overlay.text = null; // current text in readout

Overlay.init = function()
{
  Overlay.initDivs();
  Overlay.initTouch();
}

Overlay.initDivs = function()
{
  // the overlay div will contain a line of text, containing world number and enemy count
  var container = document.createElement('div');
  container.id = 'overlay';
    
  container.style.cssText = '/* width:100px; */ /* height:50px; */ opacity:0.5; cursor:pointer';

  // textBox adds padding, alignment, background
  var textBox = document.createElement('div');
  textBox.id = 'textBox';
  // padding order: top right bottom left
  // TODO gradient needs multiple declarations to work in all browsers, as per stats.js/examples/theming.html
  textBox.style.cssText = 'padding:0px 5px 0px 5px; text-align:left; background-color:#000; background-image:-webkit-linear-gradient(top, rgba(255,255,255,.4) 0%, rgba(0,0,0,.35) 100%)';
  container.appendChild(textBox);

  // text is the content
  Overlay.text = document.createElement('div');
  Overlay.text.id = 'text';
  Overlay.text.style.cssText = 'color:#0ff; font-family:Helvetica,Arial,sans-serif; font-size:36px; font-weight:bold; /* line-height:18px */';
  textBox.appendChild(Overlay.text);

  // place the overlay in the page
  container.style.position = 'absolute';
  container.style.top = '0px';
  document.body.appendChild(container);
}

Overlay.initTouch = function()
{
  // let phone users start the game
  document.addEventListener('touchstart', function (event) {
    event.preventDefault();
    Keys.shooting = true;
  }, false);
  document.addEventListener('touchend', function (event) {
    event.preventDefault();
    Keys.shooting = false;
  }, false);

  var TOUCH_CONTROLS_CSS = 'opacity:0.2; background-color: red; z-index: 11000; border-style: dashed; border-width: 2px';

  // touch fire button
  var fireButton = document.createElement('div');
  fireButton.id = 'fireButton';
    
  fireButton.style.cssText = TOUCH_CONTROLS_CSS;
  fireButton.style.width = '40%';
  fireButton.style.height = '60%';
  fireButton.style.position = 'absolute';
  fireButton.style.bottom = '0px';
  fireButton.style.right = '0px';
  // FIXME mouse to touch
  fireButton.addEventListener('mousedown', function(event) {
    Keys.shooting = true;
  });
  fireButton.addEventListener('mouseup', function(event) {
    Keys.shooting = false;
  });
  document.body.appendChild(fireButton);

  var dPadUpleft = document.createElement('div');
  dPadUpleft.id = 'dPadUpLeft';
  dPadUpleft.style.cssText = TOUCH_CONTROLS_CSS;
  dPadUpleft.style.width = '12%';
  dPadUpleft.style.height = '20%';
  dPadUpleft.style.position = 'absolute';
  dPadUpleft.style.bottom = '40%';
  dPadUpleft.style.left = '0px';
  dPadUpleft.addEventListener('mousedown', function(event) {
    Controls.current.moveForward = true;
    Controls.current.turnLeft = true;
  });
  dPadUpleft.addEventListener('mouseup', function(event) {
    Controls.current.moveForward = false;
    Controls.current.turnLeft = false;
  });
  document.body.appendChild(dPadUpleft);
}

Overlay.update = function()
{
  switch (State.current)
  {
    case State.ATTRACT:
      Overlay.text.innerHTML = 'PRESS SPACE TO BEGIN';
      break;
    case State.COMBAT:
    case State.WAIT_FOR_ENEMY:
    case State.WAIT_FOR_PORTAL:
      // TODO Player.livesLeft
      Overlay.text.innerHTML = 'W' + State.worldNumber + ' E' + State.enemiesRemaining;
      break;
    default:
      console.error('unknown state: ', State.current);
  }
}