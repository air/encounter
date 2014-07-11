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
// Gib.MATERIAL = new THREE.MeshBasicMaterial({ color: C64.white }); // initial colour only
Gib.MATERIAL = MATS.wireframe.clone();
Gib.SPEED = 0.3;
Gib.ROTATE_SPEED = -0.02;
Gib.LIFETIME_MS = 3000;
Gib.OFFSET_FROM_CENTER = 0;

// TODO in Enemy.destroyed(), don't call State.enemyKilled() until explosion is done.

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
}