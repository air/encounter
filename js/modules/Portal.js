'use strict';

import * as Obelisk from './Obelisk.js';
import { Actor } from './Actors.js';
import { log } from './UTIL.js';

// CLAUDE-TODO: These dependencies should be imported from their respective modules when converted
const State = {
  actors: {
    add: (actor) => console.log('State.actors.add called'),
    remove: (actor) => console.log('State.actors.remove called')
  }
};

const Radar = {
  TYPE_PORTAL: 'portal'
};

const clock = {
  oldTime: 0
};

// Mock TWEEN until available
const TWEEN = {
  Tween: function(object) {
    this.object = object;
    this.to = function(target, duration) {
      console.log('TWEEN.to called:', target, duration);
      return this;
    };
    this.onComplete = function(callback) {
      console.log('TWEEN.onComplete called');
      // Simulate completion after a brief delay for testing
      setTimeout(callback, 100);
      return this;
    };
    this.start = function() {
      console.log('TWEEN.start called');
      return this;
    };
  }
};

// Prototype for BlackPortal (where player enters warp) and WhitePortal (where enemies warp in).

export const STATE_OPENING = 'opening';
export const STATE_CLOSING = 'closing';

export const TIME_TO_ANIMATE_OPENING_MS = 4000;
export const TIME_TO_ANIMATE_CLOSING_MS = 3000;

// prototype state
let GEOMETRY = null;

// state to be shadowed in derived objects
let mesh = null;
let state = null;
let spawnedAt = null;
let closeStartedAt = null;

export function init() {
  GEOMETRY = new window.THREE.CylinderGeometry(40, 40, 100, 16, 1, false);
}

export function spawn(location) {
  if (location === undefined) {
    throw new Error('spawn requires location');
  }
  
  spawnedAt = clock.oldTime;
  state = STATE_OPENING;
  
  // FIXME this is temporary
  // TODO use tween chaining for the left/right then up/down opening phases!
  mesh.position.set(location.x, Obelisk.HEIGHT / 2, location.z);
  mesh.scale.y = 0.01;

  const actor = new Actor(mesh, getActorUpdateFunction(), Radar.TYPE_PORTAL);
  State.actors.add(actor);
  log('portal spawned');
  
  var tween = new TWEEN.Tween(mesh.scale).to({ y: 1.0 }, TIME_TO_ANIMATE_OPENING_MS);
  //tween.easing(TWEEN.Easing.Linear.None); // reference http://sole.github.io/tween.js/examples/03_graphs.html
  tween.onComplete(function() {
    log('portal opening tween complete');
  });
  tween.start();
}

export function startClosing() {
  log('starting to close portal');
  state = STATE_CLOSING;
  closeStartedAt = clock.oldTime;

  var tween = new TWEEN.Tween(mesh.scale).to({ y: 0.01 }, TIME_TO_ANIMATE_CLOSING_MS);
  //tween.easing(TWEEN.Easing.Linear.None); // reference http://sole.github.io/tween.js/examples/03_graphs.html
  tween.onComplete(function() {
    log('portal closing tween complete');
  });
  tween.start();
}

export function removeFromScene() {
  // CLAUDE-TODO: Need to track actor reference properly
  // State.actors.remove(this.actor);
  console.log('Portal.removeFromScene called');
}

export function updateOpening(timeDeltaMillis) {
  if ((clock.oldTime - spawnedAt) > TIME_TO_ANIMATE_OPENING_MS) {
    log('portal opened');
    opened();  // custom behaviour
  }
}

export function updateClosing(timeDeltaMillis) {
  if ((clock.oldTime - closeStartedAt) > TIME_TO_ANIMATE_CLOSING_MS) {
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
  // default no op - to be overridden by derived classes
}

// This should be overridden by derived classes
export function getActorUpdateFunction() {
  return function() {
    console.log('Portal base update function called');
  };
}

// Getters and setters for module state
export function getGeometry() { return GEOMETRY; }
export function getMesh() { return mesh; }
export function setMesh(newMesh) { mesh = newMesh; }
export function getState() { return state; }
export function setState(newState) { state = newState; }
export function getSpawnedAt() { return spawnedAt; }
export function setSpawnedAt(time) { spawnedAt = time; }
export function getCloseStartedAt() { return closeStartedAt; }
export function setCloseStartedAt(time) { closeStartedAt = time; }

// Export default object for backward compatibility
export default {
  STATE_OPENING,
  STATE_CLOSING,
  TIME_TO_ANIMATE_OPENING_MS,
  TIME_TO_ANIMATE_CLOSING_MS,
  get GEOMETRY() { return GEOMETRY; },
  get mesh() { return mesh; },
  set mesh(value) { mesh = value; },
  get state() { return state; },
  set state(value) { state = value; },
  get spawnedAt() { return spawnedAt; },
  set spawnedAt(value) { spawnedAt = value; },
  get closeStartedAt() { return closeStartedAt; },
  set closeStartedAt(value) { closeStartedAt = value; },
  init,
  spawn,
  startClosing,
  removeFromScene,
  updateOpening,
  updateClosing,
  opened,
  closed,
  getActorUpdateFunction,
  getGeometry,
  getMesh,
  setMesh,
  getState,
  setState,
  getSpawnedAt,
  setSpawnedAt,
  getCloseStartedAt,
  setCloseStartedAt
};