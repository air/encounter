import { log, error, panic } from '/js/UTIL.js';

var Timer = {};

// TODO merge with 'clock' in util.js and maybe THREE.Clock

Timer.countdowns = {};

Timer.createRepeatableCountdown = function(name, millis)
{
  Timer.countdowns[name] = millis;
  log('set up new countdown: ' + name + ', ' + millis);
};

Timer.startCountdown = function(name)
{
  return true;
};

Timer.countdownFinished = function(name)
{
  return false;
};
