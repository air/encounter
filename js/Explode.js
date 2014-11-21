'use strict';

// An exploding enemy generates flying gibs.

var Explode = {};
Explode.NUMBER_OF_GIBS = 8;
Explode.gibs = [];
Explode.gibsActive = null;

var Gib = {};
Gib.RADIUS = 80;
Gib.GEOMETRY = new THREE.SphereGeometry(Gib.RADIUS, 2, 2); // a diamond shape
Gib.SCALE_X = 0.1;
Gib.SCALE_Y = 0.4;
Gib.LIFETIME_MS = 3000;
Gib.FLICKER_FRAMES = 3; // when flickering, show each colour for this many frames
Gib.MATERIAL_PHASES = [
  {
    untilAgeMillis: 800,
    material: new THREE.MeshBasicMaterial({ color: C64.white })
  },
  {
    untilAgeMillis: 1400,
    material: new MY3.FlickeringBasicMaterial([C64.yellow, C64.white], Gib.FLICKER_FRAMES)
  },
  {
    untilAgeMillis: 2200,
    material: new MY3.FlickeringBasicMaterial([C64.lightred, C64.yellow], Gib.FLICKER_FRAMES)
  },
  {
    untilAgeMillis: 2700,
    material: new MY3.FlickeringBasicMaterial([C64.brown, C64.lightred], Gib.FLICKER_FRAMES)
  },
  {
    untilAgeMillis: Gib.LIFETIME_MS,
    material: new MY3.FlickeringBasicMaterial([C64.black, C64.brown], Gib.FLICKER_FRAMES)
  }
];
Gib.SPEED = 0.3;
Gib.ROTATE_SPEED = -0.02;
Gib.OFFSET_FROM_CENTER = 0;

// there will only ever be eight Gibs, so we can reuse them
Explode.init = function()
{
  for (var i = 0; i < Explode.NUMBER_OF_GIBS; i++)
  {
    Explode.gibs[i] = Gib.newInstance();
    Explode.gibs[i].rotateOnAxis(MY3.Y_AXIS, i * 45 * UTIL.TO_RADIANS);
  }
};

Explode.at = function(location)
{
  Explode.gibsActive = 0;

  log('sploding at location ' + Math.floor(location.x) + ', ' + Math.floor(location.z));
  for (var i = 0; i < Explode.NUMBER_OF_GIBS; i++)
  {
    Explode.gibs[i].position.copy(location);
    Explode.gibs[i].translateZ(-Gib.OFFSET_FROM_CENTER);
    Explode.gibs[i].ageMillis = 0;

    State.actors.add(Explode.gibs[i].actor);

    Explode.gibsActive += 1;
  }
};

// A Gib is actually two objects:
// 1. An invisible Object3D parent that provides a constant movement direction
// 2. A diamond mesh child that spins in place.
Gib.newInstance = function()
{
  var newGib = new THREE.Object3D();
  newGib.radarType = Radar.TYPE_PORTAL;
  newGib.ageMillis = 0;

  var gibMesh = new THREE.Mesh(Gib.GEOMETRY, Gib.MATERIAL);
  gibMesh.scale.x = Gib.SCALE_X;
  gibMesh.scale.y = Gib.SCALE_Y;

  newGib.add(gibMesh);
  newGib.mesh = gibMesh;  // provide an explicit ref to first and only child

  gibMesh.frameCounter = 0; // current flicker timer
  gibMesh.isFirstMaterial = true;  // current flicker state

  var self = newGib;
  // update is a closure passed to Actor, so we need 'self' for gib state
  var update = function(timeDeltaMillis)
  {
    self.ageMillis += timeDeltaMillis;
    if (self.ageMillis > Gib.LIFETIME_MS)
    {
      Gib.cleanUpDeadGib(self);
    }
    else
    {
      // move the parent
      var actualMoveSpeed = timeDeltaMillis * Gib.SPEED;
      self.translateZ(-actualMoveSpeed);

      // rotate the child
      self.mesh.rotateOnAxis(MY3.Y_AXIS, Gib.ROTATE_SPEED * timeDeltaMillis);

      Gib.animateMaterial(self);

      Gib.collideWithObelisks(self);
      Gib.collideWithPlayer(self);
    }
  };

  newGib.actor = new Actor(newGib, update, newGib.radarType);

  return newGib;
};

Gib.cleanUpDeadGib = function(gib)
{
  State.actors.remove(gib.actor);
  Explode.gibsActive -= 1;

  // animation is finished, move the State onward
  if (Explode.gibsActive === 0)
  {
    Enemy.cleared();
  }
};

Gib.animateMaterial = function(gib)
{
  var phase = null;
  // find the current phase based on the age
  for (phase = 0; phase < Gib.MATERIAL_PHASES.length; phase++)
  {
    if (gib.ageMillis < Gib.MATERIAL_PHASES[phase].untilAgeMillis)
    {
      break;
    }
  }

  gib.mesh.material = Gib.MATERIAL_PHASES[phase].material;
  if (gib.mesh.material instanceof MY3.FlickeringBasicMaterial)
  {
    gib.mesh.material.tick();
  }
};

Gib.collideWithObelisks = function(gib)
{
  // if an obelisk is close (fast check), do a detailed collision check
  if (Physics.isCloseToAnObelisk(gib.position, Gib.RADIUS))
  {
    // check for precise collision
    var collidePosition = Physics.isCollidingWithObelisk(gib.position, Gib.RADIUS);
    // if we get a return value we have work to do
    if (typeof collidePosition !== 'undefined')
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
