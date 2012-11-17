// Ctrl-C at http://www.superflashbros.net/as3sfxr/

// 16-sound mixer using multiple Audio instances
EncounterSound = function() {
  this.MIXSIZE = 16;
  this.audios = new Array(this.MIXSIZE);
  for (var i=0; i<this.MIXSIZE; i++) {
    this.audios[i] = new Audio();
  }
  this.audioPointer = 0;

  this.shoot = jsfxr('0,,0.1979,,0.3775,0.7516,0.2,-0.3046,,,,,,0.3302,0.0139,,,,1,,,0.1373,,0.5');
  this.thud = jsfxr('3,,0.2257,0.7679,0.201,0.0653,,,,,,,,,,0.7916,0.1249,-0.1609,1,,,,,0.5');

  EncounterSound.prototype.getAudio = function() {
    var index = this.audioPointer;
    this.audioPointer += 1;
    if (this.audioPointer >= this.MIXSIZE) this.audioPointer = 0;
    return this.audios[index];
  };

  EncounterSound.prototype.play = function(sound) {
    var audio = this.getAudio();
    audio.src = sound;
    audio.play();
  };

  EncounterSound.prototype.playerShoot = function() {
    this.play(this.shoot);
  };

  EncounterSound.prototype.playerThud = function() {
    this.play(this.thud);
  }

  EncounterSound.prototype.shotBounce = function() {
    this.play(this.thud);
  }

};