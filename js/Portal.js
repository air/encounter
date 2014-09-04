'use strict';

// Prototype for BlackPortal (where player enters warp) and WhitePortal (where enemies warp in)

var Portal = {};

Portal.STATE_OPENING = 'opening';
Portal.STATE_CLOSING = 'closing';

Portal.TIME_TO_ANIMATE_OPENING_MS = 6000;
Portal.TIME_TO_ANIMATE_CLOSING_MS = 4000;

// prototype state
Portal.GEOMETRY = null;
Portal.mesh = null;

// state to be shadowed in derived objects
Portal.state = null;
Portal.spawnedAt = null;
Portal.wasOpenedAt = null;
Portal.closeStartedAt = null;

Portal.init = function()
{
  Portal.GEOMETRY = new THREE.CylinderGeometry(40, 40, 100, 16, 1, false);
  Portal.mesh = new THREE.Mesh(Portal.GEOMETRY, new THREE.MeshLambertMaterial({ color : C64.black }));
  
  Portal.mesh.radarType = Radar.TYPE_PORTAL;
};

Portal.spawn = function()
{
  this.spawnedAt = clock.oldTime;

  // TODO don't collide with obelisk
  var spawnPosition = Grid.randomLocationCloseToPlayer(Encounter.PORTAL_SPAWN_DISTANCE_MAX);
  
  // FIXME this is temporary
  // TODO use tween chaining for the left/right then up/down opening phases!
  Portal.mesh.position.set(spawnPosition.x, Obelisk.HEIGHT / 2, spawnPosition.z);
  Portal.mesh.update = function(){};
  Portal.mesh.scale.y = 0.01;

  scene.add(Portal.mesh);
  State.actors.push(Portal.mesh);
  log('portal spawned');
  
  // let's animate!
  var tween = new TWEEN.Tween(Portal.mesh.scale).to({ y: 1.0 }, Portal.TIME_TO_ANIMATE_OPENING_MS);
  //tween.easing(TWEEN.Easing.Linear.None); // reference http://sole.github.io/tween.js/examples/03_graphs.html
  tween.onComplete(function()
  {
    log('portal opening tween complete');
  });
  tween.start();
};

Portal.removeFromScene = function()
{
  scene.remove(Portal.mesh);
  State.actorIsDead(Portal.mesh);
};
