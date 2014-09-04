'use strict';

var WhitePortal = Object.create(Portal);

WhitePortal.MATERIAL = new THREE.MeshBasicMaterial({ color: C64.white });

// additional state for white portals
WhitePortal.enemyTypeIncoming = null;

WhitePortal.init = function()
{
  WhitePortal.mesh = new THREE.Mesh(WhitePortal.GEOMETRY, WhitePortal.MATERIAL);
  WhitePortal.mesh.radarType = Radar.TYPE_PORTAL;

  WhitePortal.mesh.update = function(timeDeltaMillis)
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
};

WhitePortal.spawnForEnemy = function(enemyType)
{
  WhitePortal.enemyTypeIncoming = enemyType;
  log('spawning white portal with enemy type: ' + WhitePortal.enemyTypeIncoming);

  WhitePortal.spawn();
};

WhitePortal.opened = function()
{
  // TODO reorder this

  this.state = WhitePortal.CLOSING;

  // FIXME
  log('hacking out white portal');
  WhitePortal.state = null;
  WhitePortal.removeFromScene();
  // FIXME

  Enemy.spawnGivenTypeAt(WhitePortal.enemyTypeIncoming, WhitePortal.mesh.position);
};
