'use strict';

// ---------------------------------------
// -- jsfxr ------------------------------
// ---------------------------------------
// See http://www.superflashbros.net/as3sfxr/
export const MIXSIZE = 4;

export const SHOOT = jsfxr('0,,0.1979,,0.3775,0.7516,0.2,-0.3046,,,,,,0.3302,0.0139,,,,1,,,0.1373,,0.5');
export const ENEMY_SHOOT = jsfxr('2,,0.2489,0.2494,0.3225,0.7231,0.2,-0.2332,,,,,,0.6265,-0.2757,,,,1,,,0.1383,,0.5');
export const THUD = jsfxr('3,,0.2257,0.7679,0.201,0.0653,,,,,,,,,,0.7916,0.1249,-0.1609,1,,,,,0.5');
export const BOUNCE = jsfxr('3,,0.1806,0.4688,0.23,0.4086,,-0.2499,0.0292,0.0255,,-0.0127,,,,0.7522,,0.0393,1,0.0321,,,,0.5');
export const PLAYER_KILLED = jsfxr('3,,0.78,0.5468,0.93,0.2478,,0.1714,,0.59,0.35,,,,,0.4695,,,1,,,,,0.5');
export const SHOT_WINDUP = jsfxr('1,,0.45,,0.269,0.11,,0.2506,-0.16,,,,,0.4236,,,,,1,,,,,0.5');

// ---------------------------------------
// -- WebAudio ---------------------------
// ---------------------------------------
export const SAUCER_WAIT_FREQS = [976, 720, 464, 720];
export const SAUCER_WAIT_INTERVAL_MS = 21;
export const SAUCER_MOVE_FREQS = [976, 848, 720, 592, 464, 592, 720, 848];
export const SAUCER_MOVE_INTERVAL_MS = 22;

let audioContext = null;
let activeOscillators = null;
let audios = null;
let audioPointer = 0;

export function init() {
  audios = new Array(MIXSIZE);
  for (var i=0; i<MIXSIZE; i++)
  {
    audios[i] = new Audio();
  }
  audioPointer = 0;

  initWebAudio();
}

function getAudio() {
  var index = audioPointer;
  audioPointer += 1;
  if (audioPointer >= MIXSIZE)
  {
    audioPointer = 0;
  }
  return audios[index];
}

export function play(sound) {
  var audio = getAudio();
  audio.src = sound;
  audio.play();
}

export function playerShoot() {
  play(SHOOT);
}

export function enemyShoot() {
  muteOscillators();
  play(ENEMY_SHOOT);
}

export function playerCollideObelisk() {
  play(THUD);
}

export function shotBounce() {
  play(BOUNCE);
}

export function playerKilled() {
  muteOscillators();
  play(PLAYER_KILLED);
}

export function shotWindup() {
  muteOscillators();
  play(SHOT_WINDUP);
}

function initWebAudio() {
  audioContext = new AudioContext();
  activeOscillators = [];
}

export function saucerMove(durationMillis) {
  generateFrequencyLoop(SAUCER_MOVE_FREQS, SAUCER_MOVE_INTERVAL_MS, durationMillis);
}

export function saucerWait(durationMillis) {
  generateFrequencyLoop(SAUCER_WAIT_FREQS, SAUCER_WAIT_INTERVAL_MS, durationMillis);
}

// frequencies is an array
function generateFrequencyLoop(frequencies, intervalMillis, durationMillis) {
  // FIXME
  var DECAY_RATE = 0.000001 // per https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime
  var oscillator = audioContext.createOscillator();
  oscillator.type = 'triangle'; // per https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/type
  oscillator.connect(audioContext.destination);

  var numPoints = Math.floor(durationMillis / intervalMillis);

  var startTime = audioContext.currentTime;

  for (var point = 0; point < numPoints; point++)
  {
      var frequency = frequencies[point % frequencies.length];
      var timePointInSeconds = point * (intervalMillis / 1000);
      var actualTimePoint = startTime + timePointInSeconds;
      oscillator.frequency.setTargetAtTime(frequency, actualTimePoint, DECAY_RATE); // last param is rapidity of change
  }

  oscillator.start(startTime);
  oscillator.stop(startTime + (durationMillis / 1000));

  activeOscillators.push(oscillator);

  // cleanup
  oscillator.onended = function()
  {
    this.disconnect();
    var index = activeOscillators.indexOf(this);
    if (index > -1)
    {
      activeOscillators.splice(index, 1);
    }
  };
}

function muteOscillators() {
  var oscillator = activeOscillators.pop();
  while(oscillator !== undefined)
  {
    oscillator.disconnect();
    oscillator = activeOscillators.pop();
  }
}

// Export default object for backward compatibility
export default {
  MIXSIZE,
  SHOOT,
  ENEMY_SHOOT,
  THUD,
  BOUNCE,
  PLAYER_KILLED,
  SHOT_WINDUP,
  SAUCER_WAIT_FREQS,
  SAUCER_WAIT_INTERVAL_MS,
  SAUCER_MOVE_FREQS,
  SAUCER_MOVE_INTERVAL_MS,
  init,
  play,
  playerShoot,
  enemyShoot,
  playerCollideObelisk,
  shotBounce,
  playerKilled,
  shotWindup,
  saucerMove,
  saucerWait
};