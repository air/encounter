'use strict';

import * as C64 from './C64.js';
import * as MY3 from './MY3.js';
import * as UTIL from './UTIL.js';
import * as Physics from './Physics.js';
import * as Obelisk from './Obelisk.js';
import Sound from './Sound.js';

// CLAUDE-TODO: These dependencies should be imported from their respective modules when converted
const State = {
  actors: {
    add: (actor) => console.log('State.actors.add called'),
    remove: (actor) => console.log('State.actors.remove called')
  }
};

const Enemy = {
  cleared: () => console.log('Enemy.cleared called')
};

const Player = {
  position: { x: 0, y: 0, z: 0 },
  RADIUS: 30
};

const Actor = function(object3D, updateFunction, radarType) {
  this.object3D = object3D;
  this.update = updateFunction;
  this.radarType = radarType;
};

const Radar = {
  TYPE_NONE: 'none',
  TYPE_PORTAL: 'portal'
};

function log(msg) {
  console.log(msg);
}

// An exploding enemy generates flying gibs.
export const NUMBER_OF_GIBS = 8;
export const FLICKER_FRAMES = 2; // when flickering, show each colour for this many frames
export const LIFETIME_MS = 2200;

let ageMillis = 0;
let actor = null;
let gibs = [];

// Create the main Explode object as THREE.Object3D
const explodeObject = new window.THREE.Object3D();

export const MATERIAL_PHASES = [
  {
    untilAgeMillis: 600,
    material: new window.THREE.MeshBasicMaterial({ color: C64.white })
  },
  {
    untilAgeMillis: 1100,
    material: new MY3.FlickeringBasicMaterial([C64.yellow, C64.white], FLICKER_FRAMES)
  },
  {
    untilAgeMillis: 1600,
    material: new MY3.FlickeringBasicMaterial([C64.lightred, C64.yellow], FLICKER_FRAMES)
  },
  {
    untilAgeMillis: 2000,
    material: new MY3.FlickeringBasicMaterial([C64.brown, C64.lightred], FLICKER_FRAMES)
  },
  {
    untilAgeMillis: LIFETIME_MS,
    material: new MY3.FlickeringBasicMaterial([C64.black, C64.brown], FLICKER_FRAMES)
  }
];

export function animateMaterial() {
  // step through phase array until the age falls into range
  let phase = 0;
  for (phase = 0; phase < MATERIAL_PHASES.length; phase++)
  {
    if (ageMillis < MATERIAL_PHASES[phase].untilAgeMillis)
    {
      break;
    }
  }

  var material = MATERIAL_PHASES[phase].material;

  gibs.forEach(function(gib) {
    gib.mesh.material = material;
  });

  if (material instanceof MY3.FlickeringBasicMaterial)
  {
    material.tick();
  }
}

export function cleanUp() {
  log('cleaning up explosion');
  State.actors.remove(actor);
  gibs.forEach(function(gib) {
    State.actors.remove(gib.actor);
  });

  // animation is finished, move the State onward
  Enemy.cleared();
}

export function update(timeDeltaMillis) {
  ageMillis += timeDeltaMillis;
  if (ageMillis > LIFETIME_MS)
  {
    cleanUp();
  }
  else
  {
    animateMaterial();
  }
}

// there will only ever be eight Gibs, so we can reuse them
export function init() {
  actor = new Actor(explodeObject, update, Radar.TYPE_NONE);

  for (var i = 0; i < NUMBER_OF_GIBS; i++)
  {
    gibs[i] = Gib.newInstance();
    // rotate the Gib parent objects to radiate out evenly
    var startingAngle = 360 / NUMBER_OF_GIBS;
    gibs[i].rotateOnAxis(MY3.Y_AXIS, i * startingAngle * UTIL.TO_RADIANS);
  }
}

// location must have an x and z
export function at(location) {
  log('sploding at location ' + Math.floor(location.x) + ', ' + Math.floor(location.z));
  explodeObject.position.copy(location);  // not strictly necessary
  ageMillis = 0;
  State.actors.add(actor);

  // reset gib locations and add them to actors
  gibs.forEach(function(gib) {
    gib.position.copy(location);
    gib.translateZ(-Gib.OFFSET_FROM_CENTER);
    State.actors.add(gib.actor);
  });
}

// Gib functionality
const Gib = {};
Gib.RADIUS = 80;
Gib.GEOMETRY = new window.THREE.SphereGeometry(Gib.RADIUS, 2, 2); // a diamond shape
Gib.SCALE_X = 0.1;
Gib.SCALE_Y = 0.4;
Gib.SPEED = 0.3;
Gib.ROTATE_SPEED = -0.02;
Gib.OFFSET_FROM_CENTER = 0; // spawn this far away from the point of explosion

// A Gib is actually two objects:
// 1. An invisible Object3D parent that provides a constant movement direction
// 2. A diamond mesh child that spins in place.
Gib.newInstance = function() {
  var newGib = new window.THREE.Object3D();
  newGib.radarType = Radar.TYPE_PORTAL; // in the original this is TYPE_NONE

  var gibMesh = new window.THREE.Mesh(Gib.GEOMETRY, MATERIAL_PHASES[0].material);
  gibMesh.scale.x = Gib.SCALE_X;
  gibMesh.scale.y = Gib.SCALE_Y;

  newGib.add(gibMesh);
  newGib.mesh = gibMesh;  // provide an explicit ref to first and only child

  var self = newGib;
  // update is a closure passed to Actor, so we need 'self' for gib state
  var update = function(timeDeltaMillis)
  {
    // move the parent
    var actualMoveSpeed = timeDeltaMillis * Gib.SPEED;
    self.translateZ(-actualMoveSpeed);

    // rotate the child
    self.mesh.rotateOnAxis(MY3.Y_AXIS, Gib.ROTATE_SPEED * timeDeltaMillis);

    Gib.collideWithObelisks(self);
    Gib.collideWithPlayer(self);
  };

  newGib.actor = new Actor(newGib, update, newGib.radarType);

  return newGib;
};

Gib.collideWithObelisks = function(gib) {
  // if an obelisk is close (fast check), do a detailed collision check
  if (Physics.isCloseToAnObelisk(gib.position, Gib.RADIUS))
  {
    // check for precise collision
    var collidePosition = Physics.isCollidingWithObelisk(gib.position, Gib.RADIUS);
    // if we get a return value we have work to do
    if (collidePosition)
    {
      // we have a collision, move the gib out
      Physics.moveCircleOutOfStaticCircle(collidePosition, Obelisk.RADIUS, gib.position, Gib.RADIUS);
    }
  }
};

Gib.collideWithPlayer = function(gib) {
  if (MY3.doCirclesCollide(gib.position, Gib.RADIUS, Player.position, Player.RADIUS))
  {
    // move the gib out of the player
    Physics.moveCircleOutOfStaticCircle(Player.position, Player.RADIUS, gib.position, Gib.RADIUS);
    Sound.playerCollideObelisk();
  }
};

// Getters for module state
export function getAgeMillis() { return ageMillis; }
export function getActor() { return actor; }
export function getGibs() { return gibs; }
export function getExplodeObject() { return explodeObject; }

// Export default object for backward compatibility
export default {
  NUMBER_OF_GIBS,
  FLICKER_FRAMES,
  LIFETIME_MS,
  MATERIAL_PHASES,
  animateMaterial,
  cleanUp,
  update,
  init,
  at,
  getAgeMillis,
  getActor,
  getGibs,
  getExplodeObject
};