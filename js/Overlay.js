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

  var TOUCH_CONTROLS_CSS = 'opacity:0.2; background-color: red; z-index: 11000; border-style: dashed; border-width: 1px';

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

  var dPadUp = document.createElement('div');
  dPadUp.id = 'dPadUp';
  dPadUp.style.cssText = TOUCH_CONTROLS_CSS;
  dPadUp.style.width = '12%';
  dPadUp.style.height = '20%';
  dPadUp.style.position = 'absolute';
  dPadUp.style.bottom = '40%';
  dPadUp.style.left = '12%';
  dPadUp.addEventListener('mousedown', function(event) {
    Controls.current.moveForward = true;
  });
  dPadUp.addEventListener('mouseup', function(event) {
    Controls.current.moveForward = false;
  });
  document.body.appendChild(dPadUp);

  var dPadUpRight = document.createElement('div');
  dPadUpRight.id = 'dPadUpRight';
  dPadUpRight.style.cssText = TOUCH_CONTROLS_CSS;
  dPadUpRight.style.width = '12%';
  dPadUpRight.style.height = '20%';
  dPadUpRight.style.position = 'absolute';
  dPadUpRight.style.bottom = '40%';
  dPadUpRight.style.left = '24%';
  dPadUpRight.addEventListener('mousedown', function(event) {
    Controls.current.moveForward = true;
    Controls.current.turnRight = true;
  });
  dPadUpRight.addEventListener('mouseup', function(event) {
    Controls.current.moveForward = false;
    Controls.current.turnRight = false;
  });
  document.body.appendChild(dPadUpRight);

  var dPadLeft = document.createElement('div');
  dPadLeft.id = 'dPadLeft';
  dPadLeft.style.cssText = TOUCH_CONTROLS_CSS;
  dPadLeft.style.width = '12%';
  dPadLeft.style.height = '20%';
  dPadLeft.style.position = 'absolute';
  dPadLeft.style.bottom = '20%';
  dPadLeft.style.left = '0px';
  dPadLeft.addEventListener('mousedown', function(event) {
    Controls.current.turnLeft = true;
  });
  dPadLeft.addEventListener('mouseup', function(event) {
    Controls.current.turnLeft = false;
  });
  document.body.appendChild(dPadLeft);

  var dPadRight = document.createElement('div');
  dPadRight.id = 'dPadRight';
  dPadRight.style.cssText = TOUCH_CONTROLS_CSS;
  dPadRight.style.width = '12%';
  dPadRight.style.height = '20%';
  dPadRight.style.position = 'absolute';
  dPadRight.style.bottom = '20%';
  dPadRight.style.left = '24%';
  dPadRight.addEventListener('mousedown', function(event) {
    Controls.current.turnRight = true;
  });
  dPadRight.addEventListener('mouseup', function(event) {
    Controls.current.turnRight = false;
  });
  document.body.appendChild(dPadRight);

  var dPadDownLeft = document.createElement('div');
  dPadDownLeft.id = 'dPadDownLeft';
  dPadDownLeft.style.cssText = TOUCH_CONTROLS_CSS;
  dPadDownLeft.style.width = '12%';
  dPadDownLeft.style.height = '20%';
  dPadDownLeft.style.position = 'absolute';
  dPadDownLeft.style.bottom = '0px';
  dPadDownLeft.style.left = '0px';
  dPadDownLeft.addEventListener('mousedown', function(event) {
    Controls.current.moveBackward = true;
    Controls.current.turnLeft = true;
  });
  dPadDownLeft.addEventListener('mouseup', function(event) {
    Controls.current.moveBackward = false;
    Controls.current.turnLeft = false;
  });
  document.body.appendChild(dPadDownLeft);

  var dPadDown = document.createElement('div');
  dPadDown.id = 'dPadDown';
  dPadDown.style.cssText = TOUCH_CONTROLS_CSS;
  dPadDown.style.width = '12%';
  dPadDown.style.height = '20%';
  dPadDown.style.position = 'absolute';
  dPadDown.style.bottom = '0px';
  dPadDown.style.left = '12%';
  dPadDown.addEventListener('mousedown', function(event) {
    Controls.current.moveBackward = true;
  });
  dPadDown.addEventListener('mouseup', function(event) {
    Controls.current.moveBackward = false;
  });
  document.body.appendChild(dPadDown);

  var dPadDownRight = document.createElement('div');
  dPadDownRight.id = 'dPadDownRight';
  dPadDownRight.style.cssText = TOUCH_CONTROLS_CSS;
  dPadDownRight.style.width = '12%';
  dPadDownRight.style.height = '20%';
  dPadDownRight.style.position = 'absolute';
  dPadDownRight.style.bottom = '0px';
  dPadDownRight.style.left = '24%';
  dPadDownRight.addEventListener('mousedown', function(event) {
    Controls.current.moveBackward = true;
    Controls.current.turnRight = true;
  });
  dPadDownRight.addEventListener('mouseup', function(event) {
    Controls.current.moveBackward = false;
    Controls.current.turnRight = false;
  });
  document.body.appendChild(dPadDownRight);
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