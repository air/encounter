var Overlay = {};

Overlay.text = null; // current text in readout

Overlay.TOUCH_CONTROLS_CSS = 'opacity:0.2; background-color: red; z-index: 11000; border-style: dashed; border-width: 1px';
Overlay.DPAD_BUTTON_WIDTH_PERCENT = 12;
Overlay.DPAD_BUTTON_HEIGHT_PERCENT = 12;

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
  container.style.cssText = 'opacity:0.5';

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

Overlay.addHandlerForTouchEndAndLeave = function(div, handler)
{
  div.addEventListener('touchend', handler);
  div.addEventListener('touchleave', handler);
}

Overlay.initTouch = function()
{
  // touch fire button
  var fireButton = document.createElement('div');
  fireButton.id = 'fireButton';

  fireButton.style.cssText = Overlay.TOUCH_CONTROLS_CSS;
  fireButton.style.width = '40%';
  fireButton.style.height = (Overlay.DPAD_BUTTON_HEIGHT_PERCENT * 3) + '%';
  fireButton.style.position = 'absolute';
  fireButton.style.bottom = '0px';
  fireButton.style.right = '0px';
  fireButton.addEventListener('touchstart', function(event) {
    event.preventDefault();
    Keys.shooting = true;
  });
  Overlay.addHandlerForTouchEndAndLeave(fireButton, function(event) {
    event.preventDefault();
    Keys.shooting = false;
  });
  document.body.appendChild(fireButton);

  var dPadUpLeft = document.createElement('div');
  dPadUpLeft.id = 'dPadUpLeft';
  dPadUpLeft.style.cssText = Overlay.TOUCH_CONTROLS_CSS;
  dPadUpLeft.style.width = Overlay.DPAD_BUTTON_WIDTH_PERCENT + '%';
  dPadUpLeft.style.height = Overlay.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  dPadUpLeft.style.position = 'absolute';
  dPadUpLeft.style.bottom = (Overlay.DPAD_BUTTON_HEIGHT_PERCENT * 2) + '%';
  dPadUpLeft.style.left = '0px';
  dPadUpLeft.addEventListener('touchstart', function(event) {
    event.preventDefault();
    Controls.current.moveForward = true;
    Controls.current.turnLeft = true;
  });
  Overlay.addHandlerForTouchEndAndLeave(dPadUpLeft, function(event) {
    event.preventDefault();
    Controls.current.moveForward = false;
    Controls.current.turnLeft = false;
  });
  document.body.appendChild(dPadUpLeft);

  var dPadUp = document.createElement('div');
  dPadUp.id = 'dPadUp';
  dPadUp.style.cssText = Overlay.TOUCH_CONTROLS_CSS;
  dPadUp.style.width = Overlay.DPAD_BUTTON_WIDTH_PERCENT + '%';
  dPadUp.style.height = Overlay.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  dPadUp.style.position = 'absolute';
  dPadUp.style.bottom = (Overlay.DPAD_BUTTON_HEIGHT_PERCENT * 2) + '%';
  dPadUp.style.left = Overlay.DPAD_BUTTON_WIDTH_PERCENT + '%';
  dPadUp.addEventListener('touchstart', function(event) {
    event.preventDefault();
    Controls.current.moveForward = true;
  });
  Overlay.addHandlerForTouchEndAndLeave(dPadUp, function(event) {
    event.preventDefault();
    Controls.current.moveForward = false;
  });
  document.body.appendChild(dPadUp);

  var dPadUpRight = document.createElement('div');
  dPadUpRight.id = 'dPadUpRight';
  dPadUpRight.style.cssText = Overlay.TOUCH_CONTROLS_CSS;
  dPadUpRight.style.width = Overlay.DPAD_BUTTON_WIDTH_PERCENT + '%';
  dPadUpRight.style.height = Overlay.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  dPadUpRight.style.position = 'absolute';
  dPadUpRight.style.bottom = (Overlay.DPAD_BUTTON_HEIGHT_PERCENT * 2) + '%';
  dPadUpRight.style.left = (Overlay.DPAD_BUTTON_WIDTH_PERCENT * 2) + '%';
  dPadUpRight.addEventListener('touchstart', function(event) {
    event.preventDefault();
    Controls.current.moveForward = true;
    Controls.current.turnRight = true;
  });
  Overlay.addHandlerForTouchEndAndLeave(dPadUpRight, function(event) {
    event.preventDefault();
    Controls.current.moveForward = false;
    Controls.current.turnRight = false;
  });
  document.body.appendChild(dPadUpRight);

  var dPadLeft = document.createElement('div');
  dPadLeft.id = 'dPadLeft';
  dPadLeft.style.cssText = Overlay.TOUCH_CONTROLS_CSS;
  dPadLeft.style.width = Overlay.DPAD_BUTTON_WIDTH_PERCENT + '%';
  dPadLeft.style.height = Overlay.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  dPadLeft.style.position = 'absolute';
  dPadLeft.style.bottom = Overlay.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  dPadLeft.style.left = '0px';
  dPadLeft.addEventListener('touchstart', function(event) {
    event.preventDefault();
    Controls.current.turnLeft = true;
  });
  Overlay.addHandlerForTouchEndAndLeave(dPadLeft, function(event) {
    event.preventDefault();
    Controls.current.turnLeft = false;
  });
  document.body.appendChild(dPadLeft);

  var dPadRight = document.createElement('div');
  dPadRight.id = 'dPadRight';
  dPadRight.style.cssText = Overlay.TOUCH_CONTROLS_CSS;
  dPadRight.style.width = Overlay.DPAD_BUTTON_WIDTH_PERCENT + '%';
  dPadRight.style.height = Overlay.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  dPadRight.style.position = 'absolute';
  dPadRight.style.bottom = Overlay.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  dPadRight.style.left = (Overlay.DPAD_BUTTON_WIDTH_PERCENT * 2) + '%';
  dPadRight.addEventListener('touchstart', function(event) {
    event.preventDefault();
    Controls.current.turnRight = true;
  });
  Overlay.addHandlerForTouchEndAndLeave(dPadRight, function(event) {
    event.preventDefault();
    Controls.current.turnRight = false;
  });
  document.body.appendChild(dPadRight);

  var dPadDownLeft = document.createElement('div');
  dPadDownLeft.id = 'dPadDownLeft';
  dPadDownLeft.style.cssText = Overlay.TOUCH_CONTROLS_CSS;
  dPadDownLeft.style.width = Overlay.DPAD_BUTTON_WIDTH_PERCENT + '%';
  dPadDownLeft.style.height = Overlay.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  dPadDownLeft.style.position = 'absolute';
  dPadDownLeft.style.bottom = '0px';
  dPadDownLeft.style.left = '0px';
  dPadDownLeft.addEventListener('touchstart', function(event) {
    event.preventDefault();
    Controls.current.moveBackward = true;
    Controls.current.turnLeft = true;
  });
  Overlay.addHandlerForTouchEndAndLeave(dPadDownLeft, function(event) {
    event.preventDefault();
    Controls.current.moveBackward = false;
    Controls.current.turnLeft = false;
  });
  document.body.appendChild(dPadDownLeft);

  var dPadDown = document.createElement('div');
  dPadDown.id = 'dPadDown';
  dPadDown.style.cssText = Overlay.TOUCH_CONTROLS_CSS;
  dPadDown.style.width = Overlay.DPAD_BUTTON_WIDTH_PERCENT + '%';
  dPadDown.style.height = Overlay.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  dPadDown.style.position = 'absolute';
  dPadDown.style.bottom = '0px';
  dPadDown.style.left = Overlay.DPAD_BUTTON_WIDTH_PERCENT + '%';
  dPadDown.addEventListener('touchstart', function(event) {
    event.preventDefault();
    Controls.current.moveBackward = true;
  });
  Overlay.addHandlerForTouchEndAndLeave(dPadDown, function(event) {
    event.preventDefault();
    Controls.current.moveBackward = false;
  });
  document.body.appendChild(dPadDown);

  var dPadDownRight = document.createElement('div');
  dPadDownRight.id = 'dPadDownRight';
  dPadDownRight.style.cssText = Overlay.TOUCH_CONTROLS_CSS;
  dPadDownRight.style.width = Overlay.DPAD_BUTTON_WIDTH_PERCENT + '%';
  dPadDownRight.style.height = Overlay.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  dPadDownRight.style.position = 'absolute';
  dPadDownRight.style.bottom = '0px';
  dPadDownRight.style.left = (Overlay.DPAD_BUTTON_WIDTH_PERCENT * 2) + '%';
  dPadDownRight.addEventListener('touchstart', function(event) {
    event.preventDefault();
    Controls.current.moveBackward = true;
    Controls.current.turnRight = true;
  });
  Overlay.addHandlerForTouchEndAndLeave(dPadDownRight, function(event) {
    event.preventDefault();
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
      Overlay.text.innerHTML = 'PRESS FIRE TO BEGIN';
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