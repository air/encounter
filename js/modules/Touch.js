'use strict';

import { log, platformSupportsTouch } from './UTIL.js';
import { current as Controls_current } from './Controls.js';
import Keys from './Keys.js';

export const CONTROLS_CSS_NOFILL = 'opacity:0.1; z-index: 11000; border-style: dashed; border-width: 1px';
export const CONTROLS_CSS = 'background-color: red; ' + CONTROLS_CSS_NOFILL;
export const DPAD_BUTTON_WIDTH_PERCENT = 18;
export const DPAD_BUTTON_HEIGHT_PERCENT = 12;

export let dpad = {}; // map of dpad control objects
export let fireButton = null;

let lastDPadPressed = null;

export function init() {
  // don't init touch on desktops
  if (!platformSupportsTouch()) {
    return;
  }
  
  // disable dragging
  // FIXME this shouldn't be needed but we go a few px off bottom of screen, which enables drag
  document.addEventListener('touchmove', function(event) {
    event.preventDefault();
  });

  initFireButton();

  // pass our id, along with our press() and unpress() functions.
  // we need to do this eight times in all.
  dpad['upleft'] = createDPadButton('upleft', function() {
    Controls_current.moveForward = true;
    Controls_current.turnLeft = true;
  }, function() {
    Controls_current.moveForward = false;
    Controls_current.turnLeft = false;
  });
  dpad['upleft'].style.bottom = (DPAD_BUTTON_HEIGHT_PERCENT * 2) + '%';

  dpad['up'] = createDPadButton('up', function() {
    Controls_current.moveForward = true;
  },
  function() {
    Controls_current.moveForward = false;
  });
  dpad['up'].style.bottom = (DPAD_BUTTON_HEIGHT_PERCENT * 2) + '%';
  dpad['up'].style.left = DPAD_BUTTON_WIDTH_PERCENT + '%';

  dpad['upright'] = createDPadButton('upright', function() {
    Controls_current.moveForward = true;
    Controls_current.turnRight = true;
  }, function() {
    Controls_current.moveForward = false;
    Controls_current.turnRight = false;
  });
  dpad['upright'].style.bottom = (DPAD_BUTTON_HEIGHT_PERCENT * 2) + '%';
  dpad['upright'].style.left = (DPAD_BUTTON_WIDTH_PERCENT * 2) + '%';

  dpad['left'] = createDPadButton('left', function() {
    Controls_current.turnLeft = true;
  }, function() {
    Controls_current.turnLeft = false;
  });
  dpad['left'].style.bottom = DPAD_BUTTON_HEIGHT_PERCENT + '%';

  dpad['right'] = createDPadButton('right', function() {
    Controls_current.turnRight = true;
  }, function() {
    Controls_current.turnRight = false;
  });
  dpad['right'].style.bottom = DPAD_BUTTON_HEIGHT_PERCENT + '%';
  dpad['right'].style.left = (DPAD_BUTTON_WIDTH_PERCENT * 2) + '%';

  dpad['downleft'] = createDPadButton('downleft', function() {
    Controls_current.moveBackward = true;
    Controls_current.turnLeft = true;
  }, function() {
    Controls_current.moveBackward = false;
    Controls_current.turnLeft = false;
  });

  dpad['down'] = createDPadButton('down', function() {
    Controls_current.moveBackward = true;
  }, function() {
    Controls_current.moveBackward = false;
  });
  dpad['down'].style.left= DPAD_BUTTON_WIDTH_PERCENT + '%';

  dpad['downright'] = createDPadButton('downright', function() {
    Controls_current.moveBackward = true;
    Controls_current.turnRight = true;
  }, function() {
    Controls_current.moveBackward = false;
    Controls_current.turnRight = false;
  });
  dpad['downright'].style.left = (DPAD_BUTTON_WIDTH_PERCENT * 2) + '%';

  // create a dummy button in the middle to accept touchstarts. Override the default CSS for no red colour.
  dpad['deadzone'] = createDPadButton('deadzone', function() {
    // no op
  }, function() {
    // no op
  }, CONTROLS_CSS_NOFILL);
  dpad['deadzone'].style.left= DPAD_BUTTON_WIDTH_PERCENT + '%';
  dpad['deadzone'].style.bottom = DPAD_BUTTON_HEIGHT_PERCENT + '%';
}

// DPad buttons are divs with explicit press/unpress functions.
// This factory assumes you live at bottom-left of the screen.
function createDPadButton(id, pressFunction, unpressFunction, cssOverride) {
  var button = document.createElement('div');
  button.id = id;
  if (cssOverride) {
    button.style.cssText = cssOverride;
  } else {
    button.style.cssText = CONTROLS_CSS;
  }
  button.style.width = DPAD_BUTTON_WIDTH_PERCENT + '%';
  button.style.height = DPAD_BUTTON_HEIGHT_PERCENT + '%';
  button.style.position = 'absolute';
  button.style.bottom = '0px';
  button.style.left = '0px';

  button.press = pressFunction;
  button.unpress = unpressFunction;

  // press handler for basic touchstart case
  button.addEventListener('touchstart', function(event) {
    lastDPadPressed = button.id;
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
    var elementBeingTouched = getIdOfTouchedElement(event);
    if (elementBeingTouched in dpad) {
      dpad[elementBeingTouched].unpress();
    }
  });

  // if a touch has moved onto another button, unpress this and press the other one
  button.addEventListener('touchmove', function(event) {
    event.preventDefault();
    var elementBeingTouched = getIdOfTouchedElement(event);
    if (elementBeingTouched === lastDPadPressed) {
      // no change, no op
    } else if (elementBeingTouched in dpad) { // verify we moved onto a dpad button
      // unpress the last button if that's appropriate
      if (lastDPadPressed in dpad) {
        dpad[lastDPadPressed].unpress();
      }
      // press the new button
      dpad[elementBeingTouched].press();
      lastDPadPressed = elementBeingTouched;
    } else { // we moved off the dpad
      // unpress the last button if that's appropriate
      if (lastDPadPressed in dpad) {
        dpad[lastDPadPressed].unpress();
      }
      lastDPadPressed = null;
    }
  });

  document.body.appendChild(button);
  return button;
}

function getIdOfTouchedElement(touchEvent) {
  var touch = touchEvent.changedTouches[0];
  var element = document.elementFromPoint(touch.clientX, touch.clientY);
  // this can return null
  if (element !== null && 'id' in element) {
    return element.id;
  } else {
    return null;
  }
}

// fire button is a bit simpler, no need for any touchmove for sliding fingers
function initFireButton() {
  fireButton = document.createElement('div');
  fireButton.id = 'fireButton';
  fireButton.style.cssText = CONTROLS_CSS;
  fireButton.style.width = '40%';
  fireButton.style.height = (DPAD_BUTTON_HEIGHT_PERCENT * 3) + '%';
  fireButton.style.position = 'absolute';
  fireButton.style.bottom = '0px';
  fireButton.style.right = '0px';

  fireButton.press = function() {
    Keys.setShooting(true);
  };
  fireButton.unpress = function() {
    Keys.setShooting(false);
  };

  fireButton.addEventListener('touchstart', function(event) {
    event.preventDefault();
    fireButton.press();
  });
  fireButton.addEventListener('touchend', function(event) {
    event.preventDefault();
    fireButton.unpress();
  });
  fireButton.addEventListener('touchleave', function(event) {
    event.preventDefault();
    fireButton.unpress();
  });

  document.body.appendChild(fireButton);
}

// Export default object for backward compatibility
export default {
  CONTROLS_CSS_NOFILL,
  CONTROLS_CSS,
  DPAD_BUTTON_WIDTH_PERCENT,
  DPAD_BUTTON_HEIGHT_PERCENT,
  get dpad() { return dpad; },
  get fireButton() { return fireButton; },
  get lastDPadPressed() { return lastDPadPressed; },
  init
};