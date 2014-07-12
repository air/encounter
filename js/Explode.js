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
Gib.MATERIAL_PHASES = [
  { untilAgeMillis: 800,
    material1: new THREE.MeshBasicMaterial({ color: C64.white }),
    material2: new THREE.MeshBasicMaterial({ color: C64.white }) },
  { untilAgeMillis: 1400,
    material1: new THREE.MeshBasicMaterial({ color: C64.yellow }),
    material2: new THREE.MeshBasicMaterial({ color: C64.white }) },
  { untilAgeMillis: 2200,
    material1: new THREE.MeshBasicMaterial({ color: C64.lightred }),
    material2: new THREE.MeshBasicMaterial({ color: C64.yellow }) },
  { untilAgeMillis: 2700,
    material1: new THREE.MeshBasicMaterial({ color: C64.brown }),
    material2: new THREE.MeshBasicMaterial({ color: C64.lightred }) },
  { untilAgeMillis: Gib.LIFETIME_MS,
    material1: new THREE.MeshBasicMaterial({ color: C64.black }),
    material2: new THREE.MeshBasicMaterial({ color: C64.brown }) }
];
Gib.SPEED = 0.3;
Gib.ROTATE_SPEED = -0.02;
Gib.OFFSET_FROM_CENTER = 0;
Gib.FLICKER_FRAMES = 3; // when flickering, show each colour for this many frames

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
  log('sploding at location ' + location.x + ', ' + location.z);
  for (var i = 0; i < Explode.NUMBER_OF_GIBS; i++)
  {
    Explode.gibs[i].position.copy(location);
    Explode.gibs[i].translateZ(-Gib.OFFSET_FROM_CENTER);
    Explode.gibs[i].ageMillis = 0;

    State.actors.push(Explode.gibs[i]);
    scene.add(Explode.gibs[i]);

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

  newGib.update = function(timeDeltaMillis)
  {
    this.ageMillis += timeDeltaMillis;
    if (this.ageMillis > Gib.LIFETIME_MS)
    {
      Gib.cleanUpDeadGib(this);
    }
    else
    {
      // move the parent
      var actualMoveSpeed = timeDeltaMillis * Gib.SPEED;
      this.translateZ(-actualMoveSpeed);

      // rotate the child
      this.mesh.rotateOnAxis(MY3.Y_AXIS, Gib.ROTATE_SPEED * timeDeltaMillis);

      Gib.animateMaterial(this);

      Gib.collideWithObelisks(this);
      Gib.collideWithPlayer(this);
    }
  };

  return newGib;
};

Gib.cleanUpDeadGib = function(gib)
{
  State.actorIsDead(gib);
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
  for (phase = 0; phase < Gib.MATERIAL_PHASES.length; phase++)
  {
    if (gib.ageMillis < Gib.MATERIAL_PHASES[phase].untilAgeMillis)
    {
      break;
    }
  }

  gib.mesh.material = gib.mesh.isFirstMaterial ? Gib.MATERIAL_PHASES[phase].material1 : Gib.MATERIAL_PHASES[phase].material2;

  gib.mesh.frameCounter += 1;
  if (gib.mesh.frameCounter === Gib.FLICKER_FRAMES)
  {
    gib.mesh.isFirstMaterial = !gib.mesh.isFirstMaterial;
    gib.mesh.frameCounter = 0;
  }
};

Gib.collideWithObelisks = function(gib)
{
  // if an obelisk is close (fast check), do a detailed collision check
  if (Physics.isCloseToAnObelisk(gib.position, Gib.RADIUS))
  {
    // check for precise collision
    var obelisk = Physics.getCollidingObelisk(gib.position, Gib.RADIUS);
    // if we get a return value we have work to do
    if (typeof obelisk !== "undefined")
    {
      // we have a collision, move the gib out
      Physics.moveCircleOutOfStaticCircle(obelisk.position, Obelisk.RADIUS, gib.position, Gib.RADIUS);
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