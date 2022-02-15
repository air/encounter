import { log, error, panic } from '/js/UTIL.js';

var Touch = {};

Touch.CONTROLS_CSS_NOFILL = 'opacity:0.1; z-index: 11000; border-style: dashed; border-width: 1px';
Touch.CONTROLS_CSS =  'background-color: red; ' + Touch.CONTROLS_CSS_NOFILL;
Touch.DPAD_BUTTON_WIDTH_PERCENT = 18;
Touch.DPAD_BUTTON_HEIGHT_PERCENT = 12;

Touch.dpad = {}; // map of dpad control objects
Touch.fireButton = null;

Touch.lastDPadPressed = null;

Touch.init = function()
{
  // don't init touch on desktops
  if (!UTIL.platformSupportsTouch())
  {
    return;
  }

  // disable dragging
  // FIXME this shouldn't be needed but we go a few px off bottom of screen, which enables drag
  document.addEventListener('touchmove', function(event) {
    event.preventDefault();
  });

  Touch.initFireButton();

  // pass our id, along with our press() and unpress() functions.
  // we need to do this eight times in all.
  Touch.dpad['upleft'] = Touch.createDPadButton('upleft', function() {
    Controls.current.moveForward = true;
    Controls.current.turnLeft = true;
  }, function() {
    Controls.current.moveForward = false;
    Controls.current.turnLeft = false;
  });
  Touch.dpad['upleft'].style.bottom = (Touch.DPAD_BUTTON_HEIGHT_PERCENT * 2) + '%';

  Touch.dpad['up'] = Touch.createDPadButton('up', function() {
    Controls.current.moveForward = true;
  },
  function() {
    Controls.current.moveForward = false;
  });
  Touch.dpad['up'].style.bottom = (Touch.DPAD_BUTTON_HEIGHT_PERCENT * 2) + '%';
  Touch.dpad['up'].style.left = Touch.DPAD_BUTTON_WIDTH_PERCENT + '%';

  Touch.dpad['upright'] = Touch.createDPadButton('upright', function() {
    Controls.current.moveForward = true;
    Controls.current.turnRight = true;
  }, function() {
    Controls.current.moveForward = false;
    Controls.current.turnRight = false;
  });
  Touch.dpad['upright'].style.bottom = (Touch.DPAD_BUTTON_HEIGHT_PERCENT * 2) + '%';
  Touch.dpad['upright'].style.left = (Touch.DPAD_BUTTON_WIDTH_PERCENT * 2) + '%';

  Touch.dpad['left'] = Touch.createDPadButton('left', function() {
    Controls.current.turnLeft = true;
  }, function() {
    Controls.current.turnLeft = false;
  });
  Touch.dpad['left'].style.bottom = Touch.DPAD_BUTTON_HEIGHT_PERCENT + '%';

  Touch.dpad['right'] = Touch.createDPadButton('right', function() {
    Controls.current.turnRight = true;
  }, function() {
    Controls.current.turnRight = false;
  });
  Touch.dpad['right'].style.bottom = Touch.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  Touch.dpad['right'].style.left = (Touch.DPAD_BUTTON_WIDTH_PERCENT * 2) + '%';

  Touch.dpad['downleft'] = Touch.createDPadButton('downleft', function() {
    Controls.current.moveBackward = true;
    Controls.current.turnLeft = true;
  }, function() {
    Controls.current.moveBackward = false;
    Controls.current.turnLeft = false;
  });

  Touch.dpad['down'] = Touch.createDPadButton('down', function() {
    Controls.current.moveBackward = true;
  }, function() {
    Controls.current.moveBackward = false;
  });
  Touch.dpad['down'].style.left= Touch.DPAD_BUTTON_WIDTH_PERCENT + '%';

  Touch.dpad['downright'] = Touch.createDPadButton('downright', function() {
    Controls.current.moveBackward = true;
    Controls.current.turnRight = true;
  }, function() {
    Controls.current.moveBackward = false;
    Controls.current.turnRight = false;
  });
  Touch.dpad['downright'].style.left = (Touch.DPAD_BUTTON_WIDTH_PERCENT * 2) + '%';

  // create a dummy button in the middle to accept touchstarts. Override the default CSS for no red colour.
  Touch.dpad['deadzone'] = Touch.createDPadButton('deadzone', function() {
    // no op
  }, function() {
    // no op
  }, Touch.CONTROLS_CSS_NOFILL);
  Touch.dpad['deadzone'].style.left= Touch.DPAD_BUTTON_WIDTH_PERCENT + '%';
  Touch.dpad['deadzone'].style.bottom = Touch.DPAD_BUTTON_HEIGHT_PERCENT + '%';
};

// DPad buttons are divs with explicit press/unpress functions.
// This factory assumes you live at bottom-left of the screen.
Touch.createDPadButton = function(id, pressFunction, unpressFunction, cssOverride)
{
  var button = document.createElement('div');
  button.id = id;
  if (cssOverride)
  {
    button.style.cssText = cssOverride;
  }
  else
  {
    button.style.cssText = Touch.CONTROLS_CSS;
  }
  button.style.width = Touch.DPAD_BUTTON_WIDTH_PERCENT + '%';
  button.style.height = Touch.DPAD_BUTTON_HEIGHT_PERCENT + '%';
  button.style.position = 'absolute';
  button.style.bottom = '0px';
  button.style.left = '0px';

  button.press = pressFunction;
  button.unpress = unpressFunction;

  // press handler for basic touchstart case
  button.addEventListener('touchstart', function(event) {
    Touch.lastDPadPressed = button.id;
    event.preventDefault();
    button.press();
  });
  // touch left the canvas, seems rarely called
  button.addEventListener('touchleave', function(event) {
    log('touchleave received, how novel');
    event.preventDefault();
    button.unpress();
  });
  // touch ended. The touch may have moved to another button, so handle that
  button.addEventListener('touchend', function(event) {
    event.preventDefault();
    var elementBeingTouched = Touch.getIdOfTouchedElement(event);
    if (elementBeingTouched in Touch.dpad)
    {
      Touch.dpad[elementBeingTouched].unpress();
    }
  });

  // if a touch has moved onto another button, unpress this and press the other one
  button.addEventListener('touchmove', function(event) {
    event.preventDefault();
    var elementBeingTouched = Touch.getIdOfTouchedElement(event);
    if (elementBeingTouched === Touch.lastDPadPressed)
    {
      // no change, no op
    }
    else if (elementBeingTouched in Touch.dpad) // verify we moved onto a dpad button
    {
      // unpress the last button if that's appropriate
      if (Touch.lastDPadPressed in Touch.dpad)
      {
        Touch.dpad[Touch.lastDPadPressed].unpress();
      }
      // press the new button
      Touch.dpad[elementBeingTouched].press();
      Touch.lastDPadPressed = elementBeingTouched;
    }
    else // we moved off the dpad
    {
      // unpress the last button if that's appropriate
      if (Touch.lastDPadPressed in Touch.dpad)
      {
        Touch.dpad[Touch.lastDPadPressed].unpress();
      }
      Touch.lastDPadPressed = null;
    }
  });

  document.body.appendChild(button);
  return button;
};

Touch.getIdOfTouchedElement = function(touchEvent)
{
  var touch = touchEvent.changedTouches[0];
  var element = document.elementFromPoint(touch.clientX, touch.clientY);
  // this can return null
  if (element !== null && 'id' in element)
  {
    return element.id;
  }
  else
  {
    return null;
  }
};

// fire button is a bit simpler, no need for any touchmove for sliding fingers
Touch.initFireButton = function()
{
  Touch.fireButton = document.createElement('div');
  Touch.fireButton.id = 'fireButton';
  Touch.fireButton.style.cssText = Touch.CONTROLS_CSS;
  Touch.fireButton.style.width = '40%';
  Touch.fireButton.style.height = (Touch.DPAD_BUTTON_HEIGHT_PERCENT * 3) + '%';
  Touch.fireButton.style.position = 'absolute';
  Touch.fireButton.style.bottom = '0px';
  Touch.fireButton.style.right = '0px';

  Touch.fireButton.press = function() {
    Keys.shooting = true;
  };
  Touch.fireButton.unpress = function() {
    Keys.shooting = false;
  };

  Touch.fireButton.addEventListener('touchstart', function(event) {
    event.preventDefault();
    Touch.fireButton.press();
  });
  Touch.fireButton.addEventListener('touchend', function(event) {
    event.preventDefault();
    Touch.fireButton.unpress();
  });
  Touch.fireButton.addEventListener('touchleave', function(event) {
    event.preventDefault();
    Touch.fireButton.unpress();
  });

  document.body.appendChild(Touch.fireButton);
};
