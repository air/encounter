'use strict';

// An exploding enemy generates flying gibs.

var Explode = {};
Explode.NUMBER_OF_GIBS = 8;
Explode.gibs = [];

var Gib = {};
Gib.RADIUS = 40;
Gib.GEOMETRY = new THREE.SphereGeometry(Gib.RADIUS, 2, 2); // a diamond shape
Gib.SCALE_X = 0.2;
Gib.SCALE_Y = 0.4;
// Gib.MATERIAL = new THREE.MeshBasicMaterial({ color: C64.white }); // initial colour only
Gib.MATERIAL = MATS.wireframe.clone();
Gib.SPEED = 0.5;
Gib.LIFETIME_MS = 2800;
Gib.OFFSET_FROM_CENTER = 40;

Gib.radarType = Radar.TYPE_PORTAL;

// TODO in Enemy.destroyed(), don't call State.enemyKilled() until explosion is done.

// there will only ever be eight Gibs, so we can reuse them
Explode.init = function()
{
  for (var i = 0; i < Explode.NUMBER_OF_GIBS; i++)
  {
    Explode.gibs[i] = Gib.newInstance();
  }
};

Explode.at = function(location)
{
  log('sploding at location ' + location.x + ', ' + location.z);
  for (var i = 0; i < Explode.NUMBER_OF_GIBS; i++)
  {
    Explode.gibs[i].position.copy(location);
    Explode.gibs[i].rotateOnAxis(MY3.Y_AXIS, i * 45 * UTIL.TO_RADIANS);
    Explode.gibs[i].translateZ(-Gib.OFFSET_FROM_CENTER);

    State.actors.push(Explode.gibs[i]);
    scene.add(Explode.gibs[i]);
  }
};

Gib.newInstance = function()
{
  var newGib = new THREE.Mesh(Gib.GEOMETRY, Gib.MATERIAL);
  newGib.scale.x = Gib.SCALE_X;
  newGib.scale.y = Gib.SCALE_Y;
  newGib.radarType = Radar.TYPE_PORTAL;
  newGib.ageMillis = 0;

  newGib.update = function(timeDeltaMillis)
  {
    this.ageMillis += timeDeltaMillis;
    if (this.ageMillis > Gib.LIFETIME_MS)
    {
      Gib.cleanUpDeadGib(this);
    }
    else
    {
      // move
      var actualMoveSpeed = timeDeltaMillis * Gib.SPEED;
      this.translateZ(-actualMoveSpeed);
    }
  };

  return newGib;
};

Gib.cleanUpDeadGib = function(gib)
{
  State.actorIsDead(gib);
}