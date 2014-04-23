var Touch = {};

Touch.CONTROLS_CSS = 'opacity:0.1; background-color: red; z-index: 11000; border-style: dashed; border-width: 1px';
Touch.DPAD_BUTTON_WIDTH_PERCENT = 12;
Touch.DPAD_BUTTON_HEIGHT_PERCENT = 12;

Touch.dpad = {}; // map of dpad control objects
Touch.fireButton = null;

Touch.init = function()
{
  
  Touch.initTouch();
}

Touch.addHandlersForTouch = function(div, handler)
{
  div.addEventListener('touchend', handler);
  div.addEventListener('touchleave', handler);
  div.addEventListener('touchmove', function(event) {
    event.preventDefault();
    var touch = event.changedTouches[0];
    log('touch at ' + touch.clientX + ', ' + touch.clientY);
    log('element is ' + document.elementFromPoint(touch.clientX, touch.clientY).id);
  });
}

Touch.initTouch = function()
{
  // disable dragging
  // FIXME this shouldn't be needed but we go a few px off bottom of screen, which enables drag
  document.addEventListener('touchmove', function(event) {
    event.preventDefault();
  });

  // touch fire button
  var fireButton = document.createElement('div');
  fireButton.id = 'fireButton';

  fireButton.style.cssText = Touch.CONTROLS_CSS;
  fireButton.style.width = '40%';
  fireButton.style.height = (Touch.DPAD_BUTTON_HEIGHT_PERCENT * 3) + '%';
  fireButton.style.position = 'absolute';
  fireButton.style.bottom = '0px';
  fireButton.style.right = '0px';
  fireButton.addEventListener('touchstart', function(event) {
    event.preventDefault();
    Keys.shooting = true;
  });
  Touch.addHandlersForTouch(fireButton, function(event) {
    event.preventDefault();
    Keys.shooting = false;
  });
  document.body.appendChild(fireButton);

  var dPadUpLeft = document.createElement('div');
  dPadUpLeft.id = 'dPadUpLeft';
  dPadUpLeft.style.cssText = Touch.CONTROLS_CSS;
  dPadUpLeft.style.width = Touch.DPAD_BUTTON_WIDTH_PERCENT + '%';
  dPadUpLeft.style.height = Touch.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  dPadUpLeft.style.position = 'absolute';
  dPadUpLeft.style.bottom = (Touch.DPAD_BUTTON_HEIGHT_PERCENT * 2) + '%';
  dPadUpLeft.style.left = '0px';
  dPadUpLeft.addEventListener('touchstart', function(event) {
    event.preventDefault();
    Controls.current.moveForward = true;
    Controls.current.turnLeft = true;
  });
  Touch.addHandlersForTouch(dPadUpLeft, function(event) {
    event.preventDefault();
    Controls.current.moveForward = false;
    Controls.current.turnLeft = false;
  });
  document.body.appendChild(dPadUpLeft);

  var dPadUp = document.createElement('div');
  dPadUp.id = 'dPadUp';
  dPadUp.style.cssText = Touch.CONTROLS_CSS;
  dPadUp.style.width = Touch.DPAD_BUTTON_WIDTH_PERCENT + '%';
  dPadUp.style.height = Touch.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  dPadUp.style.position = 'absolute';
  dPadUp.style.bottom = (Touch.DPAD_BUTTON_HEIGHT_PERCENT * 2) + '%';
  dPadUp.style.left = Touch.DPAD_BUTTON_WIDTH_PERCENT + '%';
  dPadUp.addEventListener('touchstart', function(event) {
    event.preventDefault();
    Controls.current.moveForward = true;
  });
  Touch.addHandlersForTouch(dPadUp, function(event) {
    event.preventDefault();
    Controls.current.moveForward = false;
  });
  document.body.appendChild(dPadUp);

  var dPadUpRight = document.createElement('div');
  dPadUpRight.id = 'dPadUpRight';
  dPadUpRight.style.cssText = Touch.CONTROLS_CSS;
  dPadUpRight.style.width = Touch.DPAD_BUTTON_WIDTH_PERCENT + '%';
  dPadUpRight.style.height = Touch.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  dPadUpRight.style.position = 'absolute';
  dPadUpRight.style.bottom = (Touch.DPAD_BUTTON_HEIGHT_PERCENT * 2) + '%';
  dPadUpRight.style.left = (Touch.DPAD_BUTTON_WIDTH_PERCENT * 2) + '%';
  dPadUpRight.addEventListener('touchstart', function(event) {
    event.preventDefault();
    Controls.current.moveForward = true;
    Controls.current.turnRight = true;
  });
  Touch.addHandlersForTouch(dPadUpRight, function(event) {
    event.preventDefault();
    Controls.current.moveForward = false;
    Controls.current.turnRight = false;
  });
  document.body.appendChild(dPadUpRight);

  var dPadLeft = document.createElement('div');
  dPadLeft.id = 'dPadLeft';
  dPadLeft.style.cssText = Touch.CONTROLS_CSS;
  dPadLeft.style.width = Touch.DPAD_BUTTON_WIDTH_PERCENT + '%';
  dPadLeft.style.height = Touch.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  dPadLeft.style.position = 'absolute';
  dPadLeft.style.bottom = Touch.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  dPadLeft.style.left = '0px';
  dPadLeft.addEventListener('touchstart', function(event) {
    event.preventDefault();
    Controls.current.turnLeft = true;
  });
  Touch.addHandlersForTouch(dPadLeft, function(event) {
    event.preventDefault();
    Controls.current.turnLeft = false;
  });
  document.body.appendChild(dPadLeft);

  var dPadRight = document.createElement('div');
  dPadRight.id = 'dPadRight';
  dPadRight.style.cssText = Touch.CONTROLS_CSS;
  dPadRight.style.width = Touch.DPAD_BUTTON_WIDTH_PERCENT + '%';
  dPadRight.style.height = Touch.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  dPadRight.style.position = 'absolute';
  dPadRight.style.bottom = Touch.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  dPadRight.style.left = (Touch.DPAD_BUTTON_WIDTH_PERCENT * 2) + '%';
  dPadRight.addEventListener('touchstart', function(event) {
    event.preventDefault();
    Controls.current.turnRight = true;
  });
  Touch.addHandlersForTouch(dPadRight, function(event) {
    event.preventDefault();
    Controls.current.turnRight = false;
  });
  document.body.appendChild(dPadRight);

  var dPadDownLeft = document.createElement('div');
  dPadDownLeft.id = 'dPadDownLeft';
  dPadDownLeft.style.cssText = Touch.CONTROLS_CSS;
  dPadDownLeft.style.width = Touch.DPAD_BUTTON_WIDTH_PERCENT + '%';
  dPadDownLeft.style.height = Touch.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  dPadDownLeft.style.position = 'absolute';
  dPadDownLeft.style.bottom = '0px';
  dPadDownLeft.style.left = '0px';
  dPadDownLeft.addEventListener('touchstart', function(event) {
    event.preventDefault();
    Controls.current.moveBackward = true;
    Controls.current.turnLeft = true;
  });
  Touch.addHandlersForTouch(dPadDownLeft, function(event) {
    event.preventDefault();
    Controls.current.moveBackward = false;
    Controls.current.turnLeft = false;
  });
  document.body.appendChild(dPadDownLeft);

  var dPadDown = document.createElement('div');
  dPadDown.id = 'dPadDown';
  dPadDown.style.cssText = Touch.CONTROLS_CSS;
  dPadDown.style.width = Touch.DPAD_BUTTON_WIDTH_PERCENT + '%';
  dPadDown.style.height = Touch.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  dPadDown.style.position = 'absolute';
  dPadDown.style.bottom = '0px';
  dPadDown.style.left = Touch.DPAD_BUTTON_WIDTH_PERCENT + '%';
  dPadDown.addEventListener('touchstart', function(event) {
    event.preventDefault();
    Controls.current.moveBackward = true;
  });
  Touch.addHandlersForTouch(dPadDown, function(event) {
    event.preventDefault();
    Controls.current.moveBackward = false;
  });
  document.body.appendChild(dPadDown);

  var dPadDownRight = document.createElement('div');
  dPadDownRight.id = 'dPadDownRight';
  dPadDownRight.style.cssText = Touch.CONTROLS_CSS;
  dPadDownRight.style.width = Touch.DPAD_BUTTON_WIDTH_PERCENT + '%';
  dPadDownRight.style.height = Touch.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  dPadDownRight.style.position = 'absolute';
  dPadDownRight.style.bottom = '0px';
  dPadDownRight.style.left = (Touch.DPAD_BUTTON_WIDTH_PERCENT * 2) + '%';
  dPadDownRight.addEventListener('touchstart', function(event) {
    event.preventDefault();
    Controls.current.moveBackward = true;
    Controls.current.turnRight = true;
  });
  Touch.addHandlersForTouch(dPadDownRight, function(event) {
    event.preventDefault();
    Controls.current.moveBackward = false;
    Controls.current.turnRight = false;
  });
  document.body.appendChild(dPadDownRight);
}
