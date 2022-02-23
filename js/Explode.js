import * as THREE from '/lib/three.module.js'
import * as C64 from '/js/C64.js'
import * as MY3 from '/js/MY3.js'
import * as State from '/js/State.js'
import * as Actors from '/js/Actors.js'
import * as Enemy from '/js/Enemy.js'
import * as Physics from '/js/Physics.js'
import * as Radar from '/js/Radar.js'
import * as Player from '/js/Player.js'
import * as Sound from '/js/Sound.js'
import FlickeringBasicMaterial from '/js/FlickeringBasicMaterial.js';
import { log, error, panic, TO_RADIANS } from '/js/UTIL.js';

// An exploding enemy generates flying gibs.

// The object3d just serves as an anchor for gibs
const object3d = new THREE.Object3D();
const NUMBER_OF_GIBS = 8;
const FLICKER_FRAMES = 2; // when flickering, show each colour for this many frames
const LIFETIME_MS = 2200;
var gibs = [];
var ageMillis = 0;
var actor = null;

const MATERIAL_PHASES = [
  {
    untilAgeMillis: 600,
    material: new THREE.MeshBasicMaterial({ color: C64.white })
  },
  {
    untilAgeMillis: 1100,
    material: new FlickeringBasicMaterial([C64.yellow, C64.white], FLICKER_FRAMES)
  },
  {
    untilAgeMillis: 1600,
    material: new FlickeringBasicMaterial([C64.lightred, C64.yellow], FLICKER_FRAMES)
  },
  {
    untilAgeMillis: 2000,
    material: new FlickeringBasicMaterial([C64.brown, C64.lightred], FLICKER_FRAMES)
  },
  {
    untilAgeMillis: LIFETIME_MS,
    material: new FlickeringBasicMaterial([C64.black, C64.brown], FLICKER_FRAMES)
  }
];

function animateMaterial()
{
  // step through phase array until the age falls into range
  for (var phase = 0; phase < MATERIAL_PHASES.length; phase++)
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

  if (material instanceof FlickeringBasicMaterial)
  {
    material.tick();
  }
};

function cleanUp()
{
  log('cleaning up explosion');
  State.actors.remove(actor);
  gibs.forEach(function(gib) {
    State.actors.remove(gib.actor);
  });

  // animation is finished, move the State onward
  Enemy.cleared();
};

function update(timeDeltaMillis)
{
  ageMillis += timeDeltaMillis;
  if (ageMillis > LIFETIME_MS)
  {
    cleanUp();
  }
  else
  {
    animateMaterial();
  }
};

// there will only ever be eight Gibs, so we can reuse them
init = function()
{
  actor = new Actors.Actor(object3d, update, Radar.TYPE_NONE);

  for (var i = 0; i < NUMBER_OF_GIBS; i++)
  {
    gibs[i] = new Gib();
    // rotate the Gib parent objects to radiate out evenly
    var startingAngle = 360 / NUMBER_OF_GIBS;
    gibs[i].rotateOnAxis(MY3.Y_AXIS, i * startingAngle * TO_RADIANS);
  }
};

// location must have an x and z
function at(location)
{
  log('sploding at location ' + Math.floor(location.x) + ', ' + Math.floor(location.z));
  object3d.position.copy(location);  // not strictly necessary
  ageMillis = 0;
  State.actors.add(actor);

  // reset gib locations and add them to actors
  gibs.forEach(function(gib) {
    gib.position.copy(location);
    gib.translateZ(-Gib.OFFSET_FROM_CENTER);
    State.actors.add(gib.actor);
  });
};

// A Gib is actually two objects:
// 1. An invisible Object3D parent that provides a constant movement direction
// 2. A diamond mesh child that spins in place.
class Gib extends THREE.Object3D
{
  static RADIUS = 80;
  static GEOMETRY = new THREE.SphereGeometry(Gib.RADIUS, 2, 2); // a diamond shape
  static SCALE_X = 0.1;
  static SCALE_Y = 0.4;
  static SPEED = 0.3;
  static ROTATE_SPEED = -0.02;
  static OFFSET_FROM_CENTER = 0; // spawn this far away from the point of explosion

  constructor()
  {
    this.radarType = Radar.TYPE_PORTAL; // in the original this is TYPE_NONE

    let gibMesh = new THREE.Mesh(Gib.GEOMETRY, Gib.MATERIAL);
    gibMesh.scale.x = Gib.SCALE_X;
    gibMesh.scale.y = Gib.SCALE_Y;

    this.add(gibMesh);
    this.mesh = gibMesh;  // provide an explicit ref to first and only child

    // update is a closure passed to Actor, so we need to pass 'self' for gib state
    var self = this;
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

    this.actor = new Actors.Actor(this, update, this.radarType);
  }

  static collideWithObelisks(gib)
  {
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
  }

  static collideWithPlayer(gib)
  {
    if (MY3.doCirclesCollide(gib.position, Gib.RADIUS, Player.position, Player.RADIUS))
    {
      // move the gib out of the player
      Physics.moveCircleOutOfStaticCircle(Player.position, Player.RADIUS, gib.position, Gib.RADIUS);
      Sound.playerCollideObelisk();
    }
  }
}
