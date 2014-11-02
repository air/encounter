'use strict';

var UTIL = {};

//=============================================================================
// HTML/CSS
//=============================================================================

// converts the string e.g. '#ff6699' to numeric 16737945
UTIL.convertSixDigitCssRgbToNumeric = function(cssSixDigitColour)
{
  var hexString = '0x' + cssSixDigitColour.split('#')[1];
  return eval(hexString);
};

//=============================================================================
// maths
//=============================================================================
UTIL.TO_RADIANS = Math.PI / 180;
UTIL.TO_DEGREES = 180 / Math.PI;

UTIL.random = function(min, max)
{
  // handle a single arg to mean 'between 0 and arg'
  if (typeof max === 'undefined')
  {
    max = min;
    min = 0;
  }

  if (max > min)
  {
    var range = max - min + 1;
    return min + Math.floor(Math.random() * range);
  }
  else
  {
    panic('max ' + max + ' must be more than min ' + min);
    return 0;
  }
};

UTIL.randomFromArray = function(array)
{
  var diceRoll = UTIL.random(1, array.length) - 1; // adjust to be array index
  return array[diceRoll];
};

//=============================================================================
// logging
//=============================================================================
function log(msg, object)
{
  console.log(Math.floor(window.performance.now()) + ' ' + msg);
  if (typeof object !== 'undefined')
  {
    console.log(object);
  }
}

function error(msg)
{
  console.error(Math.floor(window.performance.now()) + ' ' + msg);
}

function panic(msg, object)
{
  console.error(msg);
  if (typeof object !== 'undefined')
  {
    console.log(object);
  }
  debugger;
}

//=============================================================================
// touch and mobile
//=============================================================================
UTIL.platformSupportsTouch = function()
{
  // FIXME returns false positive on Windows 8
  return 'ontouchstart' in window;
};

//=============================================================================
// make available in nodejs
//=============================================================================
if (typeof exports !== 'undefined')
{
  module.exports = UTIL;
}