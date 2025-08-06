'use strict';

import { log } from './UTIL.js';

// TODO merge with 'clock' in util.js and maybe THREE.Clock 

const countdowns = {};

export function createRepeatableCountdown(name, millis) {
  countdowns[name] = millis;
  log('set up new countdown: ' + name + ', ' + millis);
}

export function startCountdown(name) {
  return true;
}

export function countdownFinished(name) {
  return false;
}

// Export default object for backward compatibility
export default {
  countdowns,
  createRepeatableCountdown,
  startCountdown,
  countdownFinished
};