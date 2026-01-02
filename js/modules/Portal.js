'use strict';

import * as Obelisk from './Obelisk.js';
import { Actor } from './Actors.js';
import { log, panic } from './UTIL.js';
import { TYPE_PORTAL as Radar_TYPE_PORTAL } from './Radar.js';
import { getClock } from './MY3.js';
import { getActors } from './State.js';

// Portal base class for BlackPortal (where player enters warp) and WhitePortal (where enemies warp in).

export const STATE_OPENING = 'opening';
export const STATE_CLOSING = 'closing';

export const TIME_TO_ANIMATE_OPENING_MS = 4000;
export const TIME_TO_ANIMATE_CLOSING_MS = 3000;

export class Portal {
  static GEOMETRY = null;

  constructor(mesh) {
    this.mesh = mesh;
    this.state = null;
    this.spawnedAt = null;
    this.closeStartedAt = null;
    this.actor = null;
  }

  static init() {
    Portal.GEOMETRY = new window.THREE.CylinderGeometry(40, 40, 100, 16, 1, false);
  }

  spawn(location) {
    if (location === undefined) {
      panic('spawn requires location');
    }

    this.spawnedAt = getClock().oldTime;
    this.state = STATE_OPENING;

    // FIXME this is temporary
    // TODO use tween chaining for the left/right then up/down opening phases!
    this.mesh.position.set(location.x, Obelisk.HEIGHT / 2, location.z);
    this.mesh.scale.y = 0.01;

    this.actor = new Actor(this.mesh, this.getActorUpdateFunction(), Radar_TYPE_PORTAL);
    getActors().add(this.actor);
    log('portal spawned');

    const tween = new window.TWEEN.Tween(this.mesh.scale).to({ y: 1.0 }, TIME_TO_ANIMATE_OPENING_MS);
    //tween.easing(TWEEN.Easing.Linear.None); // reference http://sole.github.io/tween.js/examples/03_graphs.html
    tween.onComplete(() => {
      log('portal opening tween complete');
    });
    tween.start();
  }

  startClosing() {
    log('starting to close portal');
    this.state = STATE_CLOSING;
    this.closeStartedAt = getClock().oldTime;

    const tween = new window.TWEEN.Tween(this.mesh.scale).to({ y: 0.01 }, TIME_TO_ANIMATE_CLOSING_MS);
    //tween.easing(TWEEN.Easing.Linear.None); // reference http://sole.github.io/tween.js/examples/03_graphs.html
    tween.onComplete(() => {
      log('portal closing tween complete');
    });
    tween.start();
  }

  removeFromScene() {
    getActors().remove(this.actor);
  }

  updateOpening(timeDeltaMillis) {
    if ((getClock().oldTime - this.spawnedAt) > TIME_TO_ANIMATE_OPENING_MS) {
      log('portal opened');
      this.opened();  // custom behaviour - override in subclass
    }
  }

  updateClosing(timeDeltaMillis) {
    if ((getClock().oldTime - this.closeStartedAt) > TIME_TO_ANIMATE_CLOSING_MS) {
      log('portal closed');
      this.state = null;
      this.removeFromScene();
      this.closed();  // custom behaviour - override in subclass
    }
  }

  // Override in subclasses
  opened() {
    // default no-op
  }

  // Override in subclasses
  closed() {
    // default no-op
  }

  // Override in subclasses - this should never be called in production
  getActorUpdateFunction() {
    return (timeDeltaMillis) => {
      // Base update function - should be overridden by subclasses
    };
  }
}

export default Portal;
