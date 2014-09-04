'use strict';

var BlackPortal = Object.create(Portal);

BlackPortal.MATERIAL = new THREE.MeshBasicMaterial({ color: C64.black });

// additional states for black portals
BlackPortal.STATE_WAITING_TO_SPAWN = 'waitingToSpawn';
BlackPortal.STATE_WAITING_FOR_PLAYER = 'waitingForPlayer';
BlackPortal.STATE_PLAYER_ENTERED = 'playerEntered';

// additional state for black portals
BlackPortal.spawnTimerStartedAt = null;

BlackPortal.init = function()
{
  BlackPortal.mesh = new THREE.Mesh(BlackPortal.GEOMETRY, BlackPortal.MATERIAL);
  BlackPortal.mesh.radarType = Radar.TYPE_PORTAL;
};

BlackPortal.startSpawnTimer = function()
{
  log('started portal spawn timer');
  BlackPortal.spawnTimerStartedAt = clock.oldTime;
  BlackPortal.state = BlackPortal.STATE_WAITING_TO_SPAWN;
};

BlackPortal.spawnIfReady = function()
{
  if ((clock.oldTime - BlackPortal.spawnTimerStartedAt) > Encounter.TIME_TO_SPAWN_ENEMY_MS)
  {
    BlackPortal.spawn();
    BlackPortal.state = BlackPortal.STATE_OPENING;
  }
};

BlackPortal.updateWaitingForPlayer = function(timeDeltaMillis)
{
  if (Player.position.distanceTo(BlackPortal.mesh.position) < 70)
  {
    BlackPortal.state = BlackPortal.STATE_PLAYER_ENTERED;
    // Portal cleanup is done in Warp
  }
  else if ((clock.oldTime - BlackPortal.wasOpenedAt) > Encounter.TIME_TO_ENTER_PORTAL_MS)
  {
    log('player failed to enter portal, closing');
    BlackPortal.state = BlackPortal.STATE_CLOSING;
    BlackPortal.closeStartedAt = clock.oldTime;

    // let's animate!
    var tween = new TWEEN.Tween(BlackPortal.mesh.scale).to({ y: 0.01 }, BlackPortal.TIME_TO_ANIMATE_CLOSING_MS);
    //tween.easing(TWEEN.Easing.Linear.None); // reference http://sole.github.io/tween.js/examples/03_graphs.html
    tween.onComplete(function() {
      log('portal closing tween complete');
    });
    tween.start();
  }
};

BlackPortal.updateOpening = function(timeDeltaMillis)
{
  if ((clock.oldTime - this.spawnedAt) > BlackPortal.TIME_TO_ANIMATE_OPENING_MS)
  {
    log('black portal open');
    this.wasOpenedAt = clock.oldTime;
    this.state = BlackPortal.STATE_WAITING_FOR_PLAYER;
  }
};

BlackPortal.updateClosing = function(timeDeltaMillis)
{
  // TODO animate
  if ((clock.oldTime - this.closeStartedAt) > BlackPortal.TIME_TO_ANIMATE_CLOSING_MS)
  {
    log('black portal closed');
    BlackPortal.state = null;
    BlackPortal.removeFromScene();
    
    State.resetEnemyCounter();
    State.setupWaitForEnemy();
  }
};

BlackPortal.update = function(timeDeltaMillis)
{
  switch (BlackPortal.state)
  {
    case BlackPortal.STATE_WAITING_TO_SPAWN:
      BlackPortal.spawnIfReady();
      break;
    case BlackPortal.STATE_OPENING:
      BlackPortal.updateOpening(timeDeltaMillis);
      break;
    case BlackPortal.STATE_WAITING_FOR_PLAYER:
      BlackPortal.updateWaitingForPlayer(timeDeltaMillis);
      break;
    case BlackPortal.STATE_PLAYER_ENTERED:
      BlackPortal.state = null; // lifecycle of this portal is over
      State.setupWarp();
      break;
    case BlackPortal.STATE_CLOSING:
      BlackPortal.updateClosing(timeDeltaMillis);
      break;
    default:
      panic('unknown BlackPortal state: ' + BlackPortal.state);
  }
};
