'use strict';

// A ShotSpawner is a visible Mesh that generates a bunch of Shots

ShotSpawner.prototype = Object.create(THREE.Mesh.prototype); // inheritance style from THREE
ShotSpawner.MATERIAL = new THREE.MeshBasicMaterial({ color: C64.red });
ShotSpawner.SHOT_MATERIAL = new THREE.MeshBasicMaterial({ color: C64.lightred });

// location is a Vector3 placement for the spawner
function ShotSpawner(location)
{
  THREE.Mesh.call(this, Shot.GEOMETRY, ShotSpawner.SHOT_MATERIAL); // super constructor
  this.SHOT_INTERVAL_MILLIS = 100;
  this.lastShotAt = 0;
  this.position.copy(location);
  this.setRotationDegreesPerSecond(-45);
}

// negative number to go clockwise
ShotSpawner.prototype.setRotationDegreesPerSecond = function(degreesPerSecond)
{
  this.ROTATE_RADIANS_PER_MS = (degreesPerSecond / 1000) * UTIL.TO_RADIANS;
};

ShotSpawner.prototype.update = function(t)
{
  var rotateRadians = t * this.ROTATE_RADIANS_PER_MS;
  this.rotateOnAxis(new THREE.Vector3(0,1,0), rotateRadians);

  var timeNow = clock.oldTime;
  var millisSinceLastShot = timeNow - this.lastShotAt;
  if (millisSinceLastShot > this.SHOT_INTERVAL_MILLIS)
  {
    var shot = Shot.newInstance(this, this.position, this.rotation, ShotSpawner.SHOT_MATERIAL);
    State.actors.push(shot);
    scene.add(shot);

    this.lastShotAt = timeNow;
  }
};
