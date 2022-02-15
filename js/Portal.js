import { log, error, panic } from '/js/UTIL.js';
import * as THREE from '/lib/three.module.js'
import * as MY3 from '/js/MY3.js'
import * as Obelisk from '/js/Obelisk.js'
import * as Actors from '/js/Actors.js'
import * as Radar from '/js/Radar.js'
import * as State from '/js/State.js'

// Superclass for BlackPortal (where player enters warp) and WhitePortal (where enemies warp in).

export const STATE_OPENING = 'opening';
export const STATE_CLOSING = 'closing';

const TIME_TO_ANIMATE_OPENING_MS = 4000;
const TIME_TO_ANIMATE_CLOSING_MS = 3000;

export const GEOMETRY = new THREE.CylinderGeometry(40, 40, 100, 16, 1, false);

export class Portal
{
  constructor()
  {
    // state to be shadowed in derived objects
    this.mesh = null;
    this.state = null;
    this.spawnedAt = null;
    this.closeStartedAt = null;
  }

  spawn(location)
  {
    if (location === undefined)
    {
      panic('spawn requires location');
    }

    this.spawnedAt = MY3.clock.oldTime;
    this.state = STATE_OPENING;

    // FIXME this is temporary
    // TODO use tween chaining for the left/right then up/down opening phases!
    this.mesh.position.set(location.x, Obelisk.HEIGHT / 2, location.z);
    this.mesh.scale.y = 0.01;

    this.actor = new Actors.Actor(this.mesh, this.getActorUpdateFunction(), Radar.TYPE_PORTAL);
    State.actors.add(this.actor);
    log('portal spawned');

    var tween = new TWEEN.Tween(this.mesh.scale).to({ y: 1.0 }, TIME_TO_ANIMATE_OPENING_MS);
    //tween.easing(TWEEN.Easing.Linear.None); // reference http://sole.github.io/tween.js/examples/03_graphs.html
    tween.onComplete(function()
    {
      log('portal opening tween complete');
    });
    tween.start();
  };

  startClosing()
  {
    log('starting to close portal');
    this.state = STATE_CLOSING;
    this.closeStartedAt = MY3.clock.oldTime;

    var tween = new TWEEN.Tween(this.mesh.scale).to({ y: 0.01 }, TIME_TO_ANIMATE_CLOSING_MS);
    //tween.easing(TWEEN.Easing.Linear.None); // reference http://sole.github.io/tween.js/examples/03_graphs.html
    tween.onComplete(function() {
      log('portal closing tween complete');
    });
    tween.start();
  };

  removeFromScene()
  {
    State.actors.remove(this.actor);
  };

  updateOpening(timeDeltaMillis)
  {
    if ((MY3.clock.oldTime - this.spawnedAt) > TIME_TO_ANIMATE_OPENING_MS)
    {
      log('portal opened');
      this.opened();  // custom behaviour
    }
  };

  updateClosing(timeDeltaMillis)
  {
    if ((MY3.clock.oldTime - this.closeStartedAt) > TIME_TO_ANIMATE_CLOSING_MS)
    {
      log('portal closed');
      this.state = null;
      this.removeFromScene();
      this.closed();  // custom behaviour
    }
  };

  opened()
  {
    // default no op
  };

  closed()
  {
    // default no op
  };
}
