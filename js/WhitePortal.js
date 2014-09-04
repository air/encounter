'use strict';

var WhitePortal = Object.create(Portal);

WhitePortal.MATERIAL = new THREE.MeshBasicMaterial({ color: C64.white });

WhitePortal.init = function()
{
  WhitePortal.mesh = new THREE.Mesh(WhitePortal.GEOMETRY, WhitePortal.MATERIAL);
  WhitePortal.mesh.radarType = Radar.TYPE_PORTAL;
};

WhitePortal.setupOpening = function()
{
  WhitePortal.spawn();
  WhitePortal.state = WhitePortal.STATE_OPENING;

};

WhitePortal.updateOpening = function()
{
  if ((clock.oldTime - this.spawnedAt) > WhitePortal.TIME_TO_ANIMATE_OPENING_MS)
  {
    log('white portal open');
    this.wasOpenedAt = clock.oldTime; // FIXME not used in White
    this.state = WhitePortal.CLOSING;

    // FIXME
    log('hacking out white portal');
    WhitePortal.state = null;
    WhitePortal.removeFromScene();
    // FIXME

    Enemy.spawn();
    State.setupCombat();
  }
};

WhitePortal.updateClosing = function(timeDeltaMillis)
{
  if ((clock.oldTime - this.closeStartedAt) > WhitePortal.TIME_TO_ANIMATE_CLOSING_MS)
  {
    log('white portal closed');
    WhitePortal.state = null;
    WhitePortal.removeFromScene();
  }
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