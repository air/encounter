'use strict';

// See http://www.superflashbros.net/as3sfxr/
// 16-sound mixer using multiple Audio instances

var Sound = {};

Sound.MIXSIZE = 8;

// these codes obtained using Ctrl-C at http://www.superflashbros.net/as3sfxr/
Sound.SHOOT = jsfxr('0,,0.1979,,0.3775,0.7516,0.2,-0.3046,,,,,,0.3302,0.0139,,,,1,,,0.1373,,0.5');
Sound.ENEMY_SHOOT = jsfxr('2,,0.2489,0.2494,0.3225,0.7231,0.2,-0.2332,,,,,,0.6265,-0.2757,,,,1,,,0.1383,,0.5');
Sound.THUD = jsfxr('3,,0.2257,0.7679,0.201,0.0653,,,,,,,,,,0.7916,0.1249,-0.1609,1,,,,,0.5');
Sound.BOUNCE = jsfxr('3,,0.1806,0.4688,0.23,0.4086,,-0.2499,0.0292,0.0255,,-0.0127,,,,0.7522,,0.0393,1,0.0321,,,,0.5');
Sound.PLAYER_KILLED = jsfxr('3,,0.78,0.5468,0.93,0.2478,,0.1714,,0.59,0.35,,,,,0.4695,,,1,,,,,0.5');
Sound.SHOT_WINDUP = jsfxr('1,,0.45,,0.269,0.11,,0.2506,-0.16,,,,,0.4236,,,,,1,,,,,0.5');

Sound.init = function()
{
  Sound.audios = new Array(Sound.MIXSIZE);
  for (var i=0; i<Sound.MIXSIZE; i++)
  {
    Sound.audios[i] = new Audio();
  }
  Sound.audioPointer = 0;
}

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
  Sound.play(Sound.ENEMY_SHOOT);
};

Sound.playerCollideObelisk = function()
{
  Sound.play(Sound.THUD);
}

Sound.shotBounce = function()
{
  Sound.play(Sound.BOUNCE);
}

Sound.playerKilled = function()
{
  Sound.play(Sound.PLAYER_KILLED);
}

Sound.shotWindup = function()
{
  Sound.play(Sound.SHOT_WINDUP);
}
