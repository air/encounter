// Ctrl-C at http://www.superflashbros.net/as3sfxr/

// 16-sound mixer using multiple Audio instances
Sound = function() {
  this.MIXSIZE = 16;
  this.audios = new Array(this.MIXSIZE);
  for (var i=0; i<this.MIXSIZE; i++) {
    this.audios[i] = new Audio();
  }
  this.audioPointer = 0;

  this.shoot = jsfxr('0,,0.1979,,0.3775,0.7516,0.2,-0.3046,,,,,,0.3302,0.0139,,,,1,,,0.1373,,0.5');
  this.thud = jsfxr('3,,0.2257,0.7679,0.201,0.0653,,,,,,,,,,0.7916,0.1249,-0.1609,1,,,,,0.5');
  this.bounce = jsfxr('3,,0.1806,0.4688,0.23,0.4086,,-0.2499,0.0292,0.0255,,-0.0127,,,,0.7522,,0.0393,1,0.0321,,,,0.5');

  Sound.prototype.getAudio = function() {
    var index = this.audioPointer;
    this.audioPointer += 1;
    if (this.audioPointer >= this.MIXSIZE) this.audioPointer = 0;
    return this.audios[index];
  };

  Sound.prototype.play = function(sound) {
    var audio = this.getAudio();
    audio.src = sound;
    audio.play();
  };

  Sound.prototype.playerShoot = function() {
    this.play(this.shoot);
  };

  Sound.prototype.playerThud = function() {
    this.play(this.thud);
  }

  Sound.prototype.shotBounce = function() {
    this.play(this.bounce);
  }

};