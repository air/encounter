'use strict';

// TODO currently relies on MY3.js for clock

var UTIL = {};

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
    error('max ' + max + ' must be more than min ' + min);
    return 0;
  }
}

//=============================================================================
// logging
//=============================================================================
function log(msg)
{
  console.log(Math.floor(clock.oldTime) + ' ' + msg);
}

function error(msg)
{
  console.error(Math.floor(clock.oldTime) + ' ' + msg);
}

//=============================================================================
// touch and mobile
//=============================================================================
UTIL.platformSupportsTouch = function()
{
  return 'ontouchstart' in window;
}