"use strict";

var Portal = {};

Portal.state = null;
Portal.STATE_WAITING_TO_SPAWN = 'waitingToSpawn';
Portal.STATE_OPENING = 'opening';
Portal.STATE_WAITING_FOR_PLAYER = 'waitingForPlayer';
Portal.STATE_PLAYER_ENTERED = 'playerEntered';
Portal.STATE_CLOSING = 'closing';

Portal.TIME_TO_ANIMATE_OPENING_MS = 6000;
Portal.TIME_TO_ANIMATE_CLOSING_MS = 4000;
Portal.spawnTimerStartedAt = null;
Portal.spawnedAt = null;
Portal.wasOpenedAt = null;
Portal.closeStartedAt = null;

Portal.GEOMETRY = null;
Portal.mesh = null;

Portal.init = function()
{
  Portal.GEOMETRY = new THREE.CylinderGeometry(40, 40, 100, 16, 1, false);
  Portal.mesh = new THREE.Mesh(Portal.GEOMETRY, new THREE.MeshLambertMaterial({ color : C64.black }));
  
  Portal.mesh.radarType = Radar.TYPE_PORTAL;
}

Portal.startSpawnTimer = function()
{
  log('started portal spawn timer');
  Portal.spawnTimerStartedAt = clock.oldTime;
  Portal.state = Portal.STATE_WAITING_TO_SPAWN;
}

Portal.spawnIfReady = function()
{
  if ((clock.oldTime - Portal.spawnTimerStartedAt) > Encounter.TIME_TO_SPAWN_ENEMY_MS)
  {
    Portal.spawn();
    Portal.state = Portal.STATE_OPENING;
  }
}

Portal.spawn = function()
{
  Portal.spawnedAt = clock.oldTime;

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
}

Portal.removeFromScene = function()
{
  scene.remove(Portal.mesh);
  State.actorIsDead(Portal.mesh);
}

Portal.updateOpening = function(timeDeltaMillis)
{
  if ((clock.oldTime - Portal.spawnedAt) > Portal.TIME_TO_ANIMATE_OPENING_MS)
  {
    log('portal open');
    Portal.wasOpenedAt = clock.oldTime;
    Portal.state = Portal.STATE_WAITING_FOR_PLAYER;
  }
}

Portal.updateClosing = function(timeDeltaMillis)
{
  // TODO animate
  if ((clock.oldTime - Portal.closeStartedAt) > Portal.TIME_TO_ANIMATE_CLOSING_MS)
  {
    log('portal closed');
    Portal.state = null;
    Portal.removeFromScene();
    
    State.resetEnemyCounter();
    State.setupWaitForEnemy();
  }
}

Portal.updateWaitingForPlayer = function(timeDeltaMillis)
{
  if (Player.position.distanceTo(Portal.mesh.position) < 70)
  {
    Portal.state = Portal.STATE_PLAYER_ENTERED;
    // Portal cleanup is done in Warp
  }
  else if ((clock.oldTime - Portal.wasOpenedAt) > Encounter.TIME_TO_ENTER_PORTAL_MS)
  {
    log('player failed to enter portal, closing');
    Portal.state = Portal.STATE_CLOSING;
    Portal.closeStartedAt = clock.oldTime;

    // let's animate!
    var tween = new TWEEN.Tween(Portal.mesh.scale).to({ y: 0.01 }, Portal.TIME_TO_ANIMATE_CLOSING_MS);
    //tween.easing(TWEEN.Easing.Linear.None); // reference http://sole.github.io/tween.js/examples/03_graphs.html
    tween.onComplete(function() {
      log('portal closing tween complete');
    });
    tween.start();
  }
}

Portal.update = function(timeDeltaMillis)
{
  switch (Portal.state)
  {
    case Portal.STATE_WAITING_TO_SPAWN:
      Portal.spawnIfReady();
      break;
    case Portal.STATE_OPENING:
      Portal.updateOpening(timeDeltaMillis);
      break;
    case Portal.STATE_WAITING_FOR_PLAYER:
      Portal.updateWaitingForPlayer(timeDeltaMillis);
      break;
    case Portal.STATE_PLAYER_ENTERED:
      Portal.state = null;
      State.setupWarp();
      break;
    case Portal.STATE_CLOSING:
      Portal.updateClosing(timeDeltaMillis);
      break;
    default:
      error('unknown Portal state: ' + Portal.state);
  }

}