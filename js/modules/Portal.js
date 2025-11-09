'use strict';

import * as Obelisk from './Obelisk.js';
import { Actor } from './Actors.js';
import { log, panic } from './UTIL.js';
import { TYPE_PORTAL as Radar_TYPE_PORTAL } from './Radar.js';
import { getClock } from './MY3.js';
import { getActors } from './State.js';

// Prototype for BlackPortal (where player enters warp) and WhitePortal (where enemies warp in).

export const STATE_OPENING = 'opening';
export const STATE_CLOSING = 'closing';

export const TIME_TO_ANIMATE_OPENING_MS = 4000;
export const TIME_TO_ANIMATE_CLOSING_MS = 3000;

// prototype state
export let GEOMETRY = null;

// state to be shadowed in derived objects
export let mesh = null;
export let state = null;
export let spawnedAt = null;
export let closeStartedAt = null;
let actor = null;

export function init() {
  GEOMETRY = new window.THREE.CylinderGeometry(40, 40, 100, 16, 1, false);
}

export function setMesh(newMesh) {
  mesh = newMesh;
}

export function spawn(location) {
  if (location === undefined) {
    panic('spawn requires location');
  }

  spawnedAt = getClock().oldTime;
  state = STATE_OPENING;

  // FIXME this is temporary
  // TODO use tween chaining for the left/right then up/down opening phases!
  mesh.position.set(location.x, Obelisk.HEIGHT / 2, location.z);
  mesh.scale.y = 0.01;

  actor = new Actor(mesh, getActorUpdateFunction(), Radar_TYPE_PORTAL);
  getActors().add(actor);
  log('portal spawned');

  var tween = new window.TWEEN.Tween(mesh.scale).to({ y: 1.0 }, TIME_TO_ANIMATE_OPENING_MS);
  //tween.easing(TWEEN.Easing.Linear.None); // reference http://sole.github.io/tween.js/examples/03_graphs.html
  tween.onComplete(function() {
    log('portal opening tween complete');
  });
  tween.start();
}

export function startClosing() {
  log('starting to close portal');
  state = STATE_CLOSING;
  closeStartedAt = getClock().oldTime;

  var tween = new window.TWEEN.Tween(mesh.scale).to({ y: 0.01 }, TIME_TO_ANIMATE_CLOSING_MS);
  //tween.easing(TWEEN.Easing.Linear.None); // reference http://sole.github.io/tween.js/examples/03_graphs.html
  tween.onComplete(function() {
    log('portal closing tween complete');
  });
  tween.start();
}

export function removeFromScene() {
  getActors().remove(actor);
}

export function updateOpening(timeDeltaMillis) {
  if ((getClock().oldTime - spawnedAt) > TIME_TO_ANIMATE_OPENING_MS) {
    log('portal opened');
    opened();  // custom behaviour
  }
}

export function updateClosing(timeDeltaMillis) {
  if ((getClock().oldTime - closeStartedAt) > TIME_TO_ANIMATE_CLOSING_MS) {
    log('portal closed');
    state = null;
    removeFromScene();
    closed();  // custom behaviour
  }
}

export function opened() {
  // default no op - to be overridden by derived classes
}

export function closed() {
  // default no op
}

// This should be overridden by derived classes
export function getActorUpdateFunction() {
  return function() {
    console.log('Portal base update function called');
  };
}

// Export default object for backward compatibility
export default {
  STATE_OPENING,
  STATE_CLOSING,
  TIME_TO_ANIMATE_OPENING_MS,
  TIME_TO_ANIMATE_CLOSING_MS,
  get GEOMETRY() { return GEOMETRY; },
  set GEOMETRY(value) { GEOMETRY = value; },
  get mesh() { return mesh; },
  set mesh(value) { mesh = value; },
  get state() { return state; },
  set state(value) { state = value; },
  get spawnedAt() { return spawnedAt; },
  set spawnedAt(value) { spawnedAt = value; },
  get closeStartedAt() { return closeStartedAt; },
  set closeStartedAt(value) { closeStartedAt = value; },
  init,
  setMesh,
  spawn,
  startClosing,
  removeFromScene,
  updateOpening,
  updateClosing,
  opened,
  closed,
  getActorUpdateFunction
};