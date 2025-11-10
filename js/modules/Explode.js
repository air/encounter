'use strict';

import * as C64 from './C64.js';
import * as MY3 from './MY3.js';
import { TO_RADIANS, log } from './UTIL.js';
import * as Physics from './Physics.js';
import * as Obelisk from './Obelisk.js';
import Sound from './Sound.js';
import { TYPE_NONE, TYPE_PORTAL } from './Radar.js';
import { Actor } from './Actors.js';
import { cleared as Enemy_cleared } from './Enemy.js';
import { getActors } from './State.js';
import { getPosition as Player_getPosition, RADIUS as Player_RADIUS } from './Player.js';

// An exploding enemy generates flying gibs.

// An Explode is a dummy object, just serving as an anchor for gibs
const Explode = new window.THREE.Object3D();
export const NUMBER_OF_GIBS = 8;
let gibs = [];
export const FLICKER_FRAMES = 2; // when flickering, show each colour for this many frames
export const LIFETIME_MS = 2200;
let ageMillis = 0;
let actor = null;

// Material phases - initialized in init() to ensure FlickeringBasicMaterial is available
export let MATERIAL_PHASES = null;

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
  getActors().remove(actor);
  gibs.forEach(function(gib) {
    getActors().remove(gib.actor);
  });

  // animation is finished, move the State onward
  Enemy_cleared();
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
  // Initialize materials here, after MY3.FlickeringBasicMaterial is available
  MATERIAL_PHASES = [
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

  actor = new Actor(Explode, update, TYPE_NONE);

  for (var i = 0; i < NUMBER_OF_GIBS; i++)
  {
    gibs[i] = Gib.newInstance();
    // rotate the Gib parent objects to radiate out evenly
    var startingAngle = 360 / NUMBER_OF_GIBS;
    gibs[i].rotateOnAxis(MY3.Y_AXIS, i * startingAngle * TO_RADIANS);
  }
}

// location must have an x and z
export function at(location) {
  log('sploding at location ' + Math.floor(location.x) + ', ' + Math.floor(location.z));
  Explode.position.copy(location);  // not strictly necessary
  ageMillis = 0;
  getActors().add(actor);

  // reset gib locations and add them to actors
  gibs.forEach(function(gib) {
    gib.position.copy(location);
    gib.translateZ(-Gib.OFFSET_FROM_CENTER);
    getActors().add(gib.actor);
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
  newGib.radarType = TYPE_PORTAL; // in the original this is TYPE_NONE

  // the diamond mesh
  newGib.mesh = new window.THREE.Mesh(Gib.GEOMETRY);
  newGib.mesh.scale.x = Gib.SCALE_X;
  newGib.mesh.scale.y = Gib.SCALE_Y;
  newGib.add(newGib.mesh);

  function gibUpdate(timeDeltaMillis)
  {
    newGib.translateZ(-Gib.SPEED * timeDeltaMillis);
    newGib.mesh.rotateOnAxis(MY3.Y_AXIS, Gib.ROTATE_SPEED * timeDeltaMillis);

    // collision with obelisks
    if (Physics.isCloseToAnObelisk(newGib.position, Gib.RADIUS)) {
      // check for precise collision
      var collidePosition = Physics.isCollidingWithObelisk(newGib.position, Gib.RADIUS);
      // if we get a return there is work to do
      if (collidePosition) {
        // we have a collision, move the gib out
        Physics.moveCircleOutOfStaticCircle(collidePosition, Obelisk.RADIUS, newGib.position, Gib.RADIUS);
      }
    }

    // collision with the player
    if (MY3.doCirclesCollide(Player_getPosition(), Player_RADIUS, newGib.position, Gib.RADIUS)) {
      // move the gib out of the player
      Physics.moveCircleOutOfStaticCircle(Player_getPosition(), Player_RADIUS, newGib.position, Gib.RADIUS);
      Sound.playerCollideObelisk();
    }
  }

  newGib.actor = new Actor(newGib, gibUpdate, TYPE_PORTAL);
  return newGib;
};

// Export default object for backward compatibility
export default {
  NUMBER_OF_GIBS,
  FLICKER_FRAMES,
  LIFETIME_MS,
  get MATERIAL_PHASES() { return MATERIAL_PHASES; },
  animateMaterial,
  cleanUp,
  update,
  init,
  at
};
