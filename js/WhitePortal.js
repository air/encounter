'use strict';

var WhitePortal = Object.create(Portal);

WhitePortal.MATERIAL = new THREE.MeshBasicMaterial({ color: C64.white });

// additional state for white portals
WhitePortal.enemyTypeIncoming = null;

WhitePortal.init = function()
{
  WhitePortal.mesh = new THREE.Mesh(WhitePortal.GEOMETRY, WhitePortal.MATERIAL);
  WhitePortal.mesh.radarType = Radar.TYPE_PORTAL;
};

WhitePortal.update = function(timeDeltaMillis)
{
  switch(WhitePortal.state)
  {
    case WhitePortal.STATE_OPENING:
      WhitePortal.updateOpening(timeDeltaMillis);
      break;
    case WhitePortal.STATE_CLOSING:
      WhitePortal.updateClosing(timeDeltaMillis);
      break;
    default:
      panic('unknown WhitePortal state: ' + WhitePortal.state);
  }
};

WhitePortal.spawnForEnemy = function(enemyType)
{
  WhitePortal.enemyTypeIncoming = enemyType;
  log('spawning white portal with enemy type: ' + WhitePortal.enemyTypeIncoming);

  var location = Grid.randomLocationCloseToPlayer(Encounter.ENEMY_SPAWN_DISTANCE_MAX);
  WhitePortal.spawn(location);
  WhitePortal.mesh.radarType = Radar.TYPE_PORTAL;
};

WhitePortal.opened = function()
{
  Enemy.spawnGivenTypeAt(WhitePortal.enemyTypeIncoming, WhitePortal.mesh.position);
  WhitePortal.mesh.radarType = Radar.TYPE_NONE;
  WhitePortal.startClosing();
};
