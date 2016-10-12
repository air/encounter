'use strict';

var Sound = {};

// ---------------------------------------
// -- jsfxr ------------------------------
// ---------------------------------------
// See http://www.superflashbros.net/as3sfxr/
Sound.MIXSIZE = 4;

Sound.SHOOT = jsfxr('0,,0.1979,,0.3775,0.7516,0.2,-0.3046,,,,,,0.3302,0.0139,,,,1,,,0.1373,,0.5');
Sound.ENEMY_SHOOT = jsfxr('2,,0.2489,0.2494,0.3225,0.7231,0.2,-0.2332,,,,,,0.6265,-0.2757,,,,1,,,0.1383,,0.5');
Sound.THUD = jsfxr('3,,0.2257,0.7679,0.201,0.0653,,,,,,,,,,0.7916,0.1249,-0.1609,1,,,,,0.5');
Sound.BOUNCE = jsfxr('3,,0.1806,0.4688,0.23,0.4086,,-0.2499,0.0292,0.0255,,-0.0127,,,,0.7522,,0.0393,1,0.0321,,,,0.5');
Sound.PLAYER_KILLED = jsfxr('3,,0.78,0.5468,0.93,0.2478,,0.1714,,0.59,0.35,,,,,0.4695,,,1,,,,,0.5');
Sound.SHOT_WINDUP = jsfxr('1,,0.45,,0.269,0.11,,0.2506,-0.16,,,,,0.4236,,,,,1,,,,,0.5');

// ---------------------------------------
// -- WebAudio ---------------------------
// ---------------------------------------
Sound.SAUCER_WAIT_FREQS = [976, 720, 464, 720];
Sound.SAUCER_WAIT_INTERVAL_MS = 21;
Sound.SAUCER_MOVE_FREQS = [976, 848, 720, 592, 464, 592, 720, 848];
Sound.SAUCER_MOVE_INTERVAL_MS = 22;
Sound.audioContext = null;
Sound.activeOscillators = null;

Sound.init = function()
{
  Sound.audios = new Array(Sound.MIXSIZE);
  for (var i=0; i<Sound.MIXSIZE; i++)
  {
    Sound.audios[i] = new Audio();
  }
  Sound.audioPointer = 0;

  Sound.initWebAudio();
};

Sound.getAudio = function()
{
  var index = Sound.audioPointer;
  Sound.audioPointer += 1;
  if (Sound.audioPointer >= Sound.MIXSIZE)
  {
    Sound.audioPointer = 0;
  }
  return Sound.audios[index];
};

Sound.play = function(sound)
{
  var audio = Sound.getAudio();
  audio.src = sound;
  audio.play();
};

Sound.playerShoot = function()
{
  Sound.play(Sound.SHOOT);
};

Sound.enemyShoot = function()
{
  Sound.muteOscillators();
  Sound.play(Sound.ENEMY_SHOOT);
};

Sound.playerCollideObelisk = function()
{
  Sound.play(Sound.THUD);
};

Sound.shotBounce = function()
{
  Sound.play(Sound.BOUNCE);
};

Sound.playerKilled = function()
{
  Sound.muteOscillators();
  Sound.play(Sound.PLAYER_KILLED);
};

Sound.shotWindup = function()
{
  Sound.muteOscillators();
  Sound.play(Sound.SHOT_WINDUP);
};

Sound.initWebAudio = function()
{
  Sound.audioContext = new AudioContext();
  Sound.activeOscillators = [];
};

Sound.saucerMove = function(durationMillis)
{
  Sound.generateFrequencyLoop(Sound.SAUCER_MOVE_FREQS, Sound.SAUCER_MOVE_INTERVAL_MS, durationMillis);
};

Sound.saucerWait = function(durationMillis)
{
  Sound.generateFrequencyLoop(Sound.SAUCER_WAIT_FREQS, Sound.SAUCER_WAIT_INTERVAL_MS, durationMillis);
};

// frequencies is an array
Sound.generateFrequencyLoop = function(frequencies, intervalMillis, durationMillis)
{
  var oscillator = Sound.audioContext.createOscillator();
  oscillator.type = 'sine'; // per https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/type
  oscillator.connect(Sound.audioContext.destination);

  var numPoints = Math.floor(durationMillis / intervalMillis);

  var startTime = Sound.audioContext.currentTime;

  for (var point = 0; point < numPoints; point++)
  {
      var frequency = frequencies[point % frequencies.length];
      var timePointInSeconds = point * (intervalMillis / 1000);
      var actualTimePoint = startTime + timePointInSeconds;
      oscillator.frequency.setTargetAtTime(frequency, actualTimePoint, 0); // last param is rapidity of change
  }

  oscillator.start(startTime);
  oscillator.stop(startTime + (durationMillis / 1000));

  Sound.activeOscillators.push(oscillator);

  // cleanup
  oscillator.onended = function()
  {
    this.disconnect();
    var index = Sound.activeOscillators.indexOf(this);
    if (index > -1)
    {
      Sound.activeOscillators.splice(index, 1);
    }
  };
};

Sound.muteOscillators = function()
{
  var oscillator = Sound.activeOscillators.pop();
  while(oscillator !== undefined)
  {
    oscillator.disconnect();
    oscillator = Sound.activeOscillators.pop();
  }
};
