'use strict';

// Prototype for BlackPortal (where player enters warp) and WhitePortal (where enemies warp in).

var Portal = {};

Portal.STATE_OPENING = 'opening';
Portal.STATE_CLOSING = 'closing';

Portal.TIME_TO_ANIMATE_OPENING_MS = 4000;
Portal.TIME_TO_ANIMATE_CLOSING_MS = 3000;

// prototype state
Portal.GEOMETRY = null;

// state to be shadowed in derived objects
Portal.mesh = null;
Portal.state = null;
Portal.spawnedAt = null;
Portal.closeStartedAt = null;

Portal.init = function()
{
  Portal.GEOMETRY = new THREE.CylinderGeometry(40, 40, 100, 16, 1, false);
};

Portal.spawn = function(location)
{
  if (location === undefined)
  {
    panic('spawn requires location');
  }
  
  this.spawnedAt = clock.oldTime;
  this.state = Portal.STATE_OPENING;
  
  // FIXME this is temporary
  // TODO use tween chaining for the left/right then up/down opening phases!
  this.mesh.position.set(location.x, Obelisk.HEIGHT / 2, location.z);
  this.mesh.scale.y = 0.01;

  this.actor = new Actor(this.mesh, this.getActorUpdateFunction(), Radar.TYPE_PORTAL);
  State.actors.add(this.actor);
  log('portal spawned');
  
  var tween = new TWEEN.Tween(this.mesh.scale).to({ y: 1.0 }, Portal.TIME_TO_ANIMATE_OPENING_MS);
  //tween.easing(TWEEN.Easing.Linear.None); // reference http://sole.github.io/tween.js/examples/03_graphs.html
  tween.onComplete(function()
  {
    log('portal opening tween complete');
  });
  tween.start();
};

Portal.startClosing = function()
{
  log('starting to close portal');
  this.state = Portal.STATE_CLOSING;
  this.closeStartedAt = clock.oldTime;

  var tween = new TWEEN.Tween(this.mesh.scale).to({ y: 0.01 }, Portal.TIME_TO_ANIMATE_CLOSING_MS);
  //tween.easing(TWEEN.Easing.Linear.None); // reference http://sole.github.io/tween.js/examples/03_graphs.html
  tween.onComplete(function() {
    log('portal closing tween complete');
  });
  tween.start();
};

Portal.removeFromScene = function()
{
  State.actors.remove(this.actor);
};

Portal.updateOpening = function(timeDeltaMillis)
{
  if ((clock.oldTime - this.spawnedAt) > Portal.TIME_TO_ANIMATE_OPENING_MS)
  {
    log('portal opened');
    this.opened();  // custom behaviour
  }
};

Portal.updateClosing = function(timeDeltaMillis)
{
  if ((clock.oldTime - this.closeStartedAt) > Portal.TIME_TO_ANIMATE_CLOSING_MS)
  {
    log('portal closed');
    this.state = null;
    this.removeFromScene();
    this.closed();  // custom behaviour
  }
};

Portal.opened = function()
{
  // default no op
};

Portal.closed = function()
{
  // default no op
};
