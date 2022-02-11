'use strict';

// An exploding enemy generates flying gibs.

// An Explode is a dummy object, just serving as an anchor for gibs
var Explode = new THREE.Object3D();
Explode.NUMBER_OF_GIBS = 8;
Explode.gibs = [];
Explode.FLICKER_FRAMES = 2; // when flickering, show each colour for this many frames
Explode.LIFETIME_MS = 2200;
Explode.ageMillis = 0;
Explode.actor = null;
Explode.MATERIAL_PHASES = [
  {
    untilAgeMillis: 600,
    material: new THREE.MeshBasicMaterial({ color: C64.white })
  },
  {
    untilAgeMillis: 1100,
    material: new FlickeringBasicMaterial([C64.yellow, C64.white], Explode.FLICKER_FRAMES)
  },
  {
    untilAgeMillis: 1600,
    material: new FlickeringBasicMaterial([C64.lightred, C64.yellow], Explode.FLICKER_FRAMES)
  },
  {
    untilAgeMillis: 2000,
    material: new FlickeringBasicMaterial([C64.brown, C64.lightred], Explode.FLICKER_FRAMES)
  },
  {
    untilAgeMillis: Explode.LIFETIME_MS,
    material: new FlickeringBasicMaterial([C64.black, C64.brown], Explode.FLICKER_FRAMES)
  }
];

Explode.animateMaterial = function()
{
  // step through phase array until the age falls into range
  for (var phase = 0; phase < Explode.MATERIAL_PHASES.length; phase++)
  {
    if (Explode.ageMillis < Explode.MATERIAL_PHASES[phase].untilAgeMillis)
    {
      break;
    }
  }

  var material = Explode.MATERIAL_PHASES[phase].material;

  Explode.gibs.forEach(function(gib) {
    gib.mesh.material = material;
  });

  if (material instanceof FlickeringBasicMaterial)
  {
    material.tick();
  }
};

Explode.cleanUp = function()
{
  log('cleaning up explosion');
  State.actors.remove(Explode.actor);
  Explode.gibs.forEach(function(gib) {
    State.actors.remove(gib.actor);
  });

  // animation is finished, move the State onward
  Enemy.cleared();
};

Explode.update = function(timeDeltaMillis)
{
  Explode.ageMillis += timeDeltaMillis;
  if (Explode.ageMillis > Explode.LIFETIME_MS)
  {
    Explode.cleanUp();
  }
  else
  {
    Explode.animateMaterial();
  }
};

// there will only ever be eight Gibs, so we can reuse them
Explode.init = function()
{
  Explode.actor = new Actor(Explode, Explode.update, Radar.TYPE_NONE);

  for (var i = 0; i < Explode.NUMBER_OF_GIBS; i++)
  {
    Explode.gibs[i] = Gib.newInstance();
    // rotate the Gib parent objects to radiate out evenly
    var startingAngle = 360 / Explode.NUMBER_OF_GIBS;
    Explode.gibs[i].rotateOnAxis(MY3.Y_AXIS, i * startingAngle * UTIL.TO_RADIANS);
  }
};

// location must have an x and z
Explode.at = function(location)
{
  log('sploding at location ' + Math.floor(location.x) + ', ' + Math.floor(location.z));
  Explode.position.copy(location);  // not strictly necessary
  Explode.ageMillis = 0;
  State.actors.add(Explode.actor);

  // reset gib locations and add them to actors
  Explode.gibs.forEach(function(gib) {
    gib.position.copy(location);
    gib.translateZ(-Gib.OFFSET_FROM_CENTER);
    State.actors.add(gib.actor);
  });
};

var Gib = {};
Gib.RADIUS = 80;
Gib.GEOMETRY = new THREE.SphereGeometry(Gib.RADIUS, 2, 2); // a diamond shape
Gib.SCALE_X = 0.1;
Gib.SCALE_Y = 0.4;
Gib.SPEED = 0.3;
Gib.ROTATE_SPEED = -0.02;
Gib.OFFSET_FROM_CENTER = 0; // spawn this far away from the point of explosion

// A Gib is actually two objects:
// 1. An invisible Object3D parent that provides a constant movement direction
// 2. A diamond mesh child that spins in place.
Gib.newInstance = function()
{
  var newGib = new THREE.Object3D();
  newGib.radarType = Radar.TYPE_PORTAL; // in the original this is TYPE_NONE

  var gibMesh = new THREE.Mesh(Gib.GEOMETRY, Gib.MATERIAL);
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

Gib.collideWithObelisks = function(gib)
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
};

Gib.collideWithPlayer = function(gib)
{
  if (MY3.doCirclesCollide(gib.position, Gib.RADIUS, Player.position, Player.RADIUS))
  {
    // move the gib out of the player
    Physics.moveCircleOutOfStaticCircle(Player.position, Player.RADIUS, gib.position, Gib.RADIUS);
    Sound.playerCollideObelisk();
  }
};
