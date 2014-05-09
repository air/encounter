'use strict';

var Timer = {};

// TODO merge with 'clock' in util.js and maybe THREE.Clock 
// FIXME how the fuck do you do a map with dynamic keys?

Timer.countdowns = {};

// object and key MUST be strings
// to set a string value, pass "'mystring'"
function set(object, key, value)
{
  var hack = object + '.' + key + ' = ' + value + ';';
  eval(hack);
} 

function get(object, key)
{
  var hack = object + '.' + key + ';';
  return eval(hack);
}

Timer.createRepeatableCountdown = function(name, millis)
{
  set('Timer.countdowns', name, millis);
  log('set up new countdown: ' + name + ', ' + millis);
}

Timer.startCountdown = function(name)
{

}

Timer.countdownFinished = function(name)
{
  return false;
}