// Ctrl-C at http://www.superflashbros.net/as3sfxr/

EncounterSound = function() {
  this.audio = new Audio();
  this.shoot = jsfxr('0,,0.1979,,0.3775,0.7516,0.2,-0.3046,,,,,,0.3302,0.0139,,,,1,,,0.1373,,0.5');
  this.thud = jsfxr('3,,0.2257,0.7679,0.201,0.0653,,,,,,,,,,0.7916,0.1249,-0.1609,1,,,,,0.5');

  this.playerShoot = function() {
    this.audio.src = this.shoot;
    this.audio.play();
  };

  this.playerThud = function() {
    this.audio.src = this.thud;
    this.audio.play();
  }

};