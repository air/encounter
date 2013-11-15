// Player or enemy shot

// define this so we can define some constants on it
function Shot() {};

// static constants FIXME make caps
Shot.radius = 40;
Shot.offset = 120; // created this far in front of you
Shot.canTravel = 16000; // TODO confirm
Shot.geometry = new THREE.SphereGeometry(Shot.radius, 16, 16);
Shot.material = MATS.normal;
// set material to undefined for lovely colours!
//Shot.material = MATS.wireframe;

// Class definition style 2 of 3, see EncounterPhysics and Obelisk
// A Shot is_a THREE.Mesh
Shot.prototype = Object.create(THREE.Mesh.prototype); // inheritance style from THREE
// a firingObject has a position and a rotation from which the shot emerges
function Shot(firingObject) {
  THREE.Mesh.call(this, Shot.geometry, Shot.material); // super constructor

  this.position.copy(firingObject.position);
  this.rotation.copy(firingObject.rotation);
  this.updateMatrix(); // push the position/rotation changes into the underlying matrix
  this.translateZ(-Shot.offset); // this depends on the matrix being up to date
  this.isDead = false;
  this.hasTravelled = 0;
  this.radius = Shot.radius;
  this.closeObeliskIndex = new THREE.Vector2(0,0);
}

Shot.prototype.update = function(t) {
  // move
  var actualMoveSpeed = t * ENCOUNTER.shotSpeed;
  this.translateZ(-actualMoveSpeed);
  this.hasTravelled += actualMoveSpeed;

  if (physics.debug)
  {
    // unhighlight the old closest obelisk
    physics.unHighlightObelisk(this.closeObeliskIndex.x, this.closeObeliskIndex.y);
  }

  // if an obelisk is close (fast check), highlight it to a small degree and do further collision checks
  if (physics.isCloseToAnObelisk(this.position, Shot.radius)) {
    // check for precise collision
    var obelisk = physics.getCollidingObelisk(this.position, Shot.radius);
    if (typeof obelisk !== "undefined") {
      // we have a collision, bounce
      physics.bounceObjectOutOfIntersectingCircle(obelisk.position, Obelisk.radius, this);
      sound.shotBounce();
      if (physics.debug)
      {
        physics.highlightObelisk(this.closeObeliskIndex.x, this.closeObeliskIndex.y, 6);
      }
    } else {
      // otherwise a near miss, highlight for debug purposes
      if (physics.debug)
      {
        physics.highlightObelisk(this.closeObeliskIndex.x, this.closeObeliskIndex.y, 2);
      }
    }
  }

  if (physics.debug)
  {
    // always need to know the closest for drawing the debug line
    this.closeObeliskIndex = physics.getClosestObelisk(this.position);

    // kill old line and add a new one
    scene.remove(this.line);
    scene.remove(this.pointer);

    // get the obelisk object itself to read its position
    var obelisk = Grid.rows[this.closeObeliskIndex.y][this.closeObeliskIndex.x];
    this.line = new MY3.Line(this.position, obelisk.position);
    
    this.pointer = new MY3.Pointer(this.position, physics.objectRotationAsUnitVector(this), 200);
    scene.add(this.line);
    scene.add(this.pointer);
  }

  if (this.hasTravelled > Shot.canTravel) {
    this.isDead = true;
    if (physics.debug)
    {
      scene.remove(this.line);
      scene.remove(this.pointer);
      physics.unHighlightObelisk(this.closeObeliskIndex.x, this.closeObeliskIndex.y);
    }
  }
  if (this.isDead) {
    this.deadCallback.apply(undefined, [this]); // just pass reference to this actor
  }
}

Shot.prototype.callbackWhenDead = function(callback) {
  this.deadCallback = callback;
}

ShotSpawner.prototype = Object.create(THREE.Mesh.prototype); // inheritance style from THREE
// location is a Vector3 placement for the spawner
function ShotSpawner(location) {
  THREE.Mesh.call(this, Shot.geometry, MATS.red); // super constructor
  this.SHOT_INTERVAL_MILLIS = 50;
  this.lastShotAt = 0;
  this.position.copy(location);
  this.setRotationDegreesPerSecond(-45);
}

// negative number to go clockwise
ShotSpawner.prototype.setRotationDegreesPerSecond = function(degreesPerSecond) {
  this.ROTATE_RADIANS_PER_MS = (degreesPerSecond / 1000) * TO_RADIANS;
}

ShotSpawner.prototype.update = function(t) {
  var rotateRadians = t * this.ROTATE_RADIANS_PER_MS;
  this.rotateOnAxis(new THREE.Vector3(0,1,0), rotateRadians);

  var timeNow = clock.oldTime;
  var millisSinceLastShot = timeNow - this.lastShotAt;
  if (millisSinceLastShot > this.SHOT_INTERVAL_MILLIS)
  {
    shoot(this, new Date().getTime());
    this.lastShotAt = timeNow;
  }
}