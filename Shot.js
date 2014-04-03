// Usage: A real class for use with 'new'.

// Player or enemy shot

// define this so we can define some constants on it
function Shot() {};

// static constants
// FIXME every instance of Shot has a copy of these? Rubbish
Shot.RADIUS = 40;
Shot.OFFSET_FROM_SHOOTER = 120; // created this far in front of you
Shot.CAN_TRAVEL = 16000; // TODO confirm
Shot.GEOMETRY = new THREE.SphereGeometry(Shot.RADIUS, 16, 16);
Shot.MATERIAL = MATS.normal;
// set material to undefined for lovely colours!
//Shot.MATERIAL = MATS.wireframe;

// A Shot is_a THREE.Mesh
Shot.prototype = Object.create(THREE.Mesh.prototype); // inheritance style from THREE
// a firingObject has a position and a rotation from which the shot emerges
// FIXME assumptions about input = bad
function Shot(firingObject) {
  THREE.Mesh.call(this, Shot.GEOMETRY, Shot.MATERIAL); // super constructor
  this.shooter = firingObject;

  this.position.copy(firingObject.position);
  this.rotation.copy(firingObject.rotation);
  this.updateMatrix(); // push the position/rotation changes into the underlying matrix
  this.translateZ(-Shot.OFFSET_FROM_SHOOTER); // this depends on the matrix being up to date

  // FIXME what a piece of shit object model
  this.RADIUS = Shot.RADIUS;

  this.hasTravelled = 0;
  // for debug only
  this.closeObeliskIndex = new THREE.Vector2(0,0); // not actually true at init time
}

Shot.prototype.collideWithObelisks = function()
{
  // if an obelisk is close (fast check), do a detailed collision check
  if (physics.isCloseToAnObelisk(this.position, Shot.RADIUS))
  {
    // check for precise collision
    var obelisk = physics.getCollidingObelisk(this.position, Shot.RADIUS);
    // if we get a return value we have work to do
    if (typeof obelisk !== "undefined")
    {
      // we have a collision, bounce
      physics.bounceObjectOutOfIntersectingCircle(obelisk.position, Obelisk.RADIUS, this);
      sound.shotBounce();
      
      if (physics.debug)
      {
        physics.highlightObelisk(this.closeObeliskIndex.x, this.closeObeliskIndex.y, 6);
      }
    }
    else if (physics.debug)
    {
      // otherwise a near miss, highlight for debug purposes
      physics.highlightObelisk(this.closeObeliskIndex.x, this.closeObeliskIndex.y, 2);
    }
  }

  // draw some informational lines if we're in debug mode
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
}

Shot.prototype.collideWithShips = function()
{
  // kill the player
  if (physics.doCirclesCollide(this.position, Shot.RADIUS, Player.position, Player.RADIUS))
  {
    Player.wasHit();
  }
  // kill the enemy
  if (Enemy.isAlive && physics.doCirclesCollide(this.position, Shot.RADIUS, Enemy.position, Enemy.RADIUS))
  {
    Enemy.destroyed();
    // remove the shot
    this.cleanUpDeadShot();
  }
}

Shot.prototype.cleanUpDeadShot = function()
{
  // clean up debug lines
  if (physics.debug)
  {
    scene.remove(this.line);
    scene.remove(this.pointer);
    physics.unHighlightObelisk(this.closeObeliskIndex.x, this.closeObeliskIndex.y);
  }

  this.deadCallback.apply(undefined, [this]); // just pass reference to this actor
}

Shot.prototype.update = function(timeDeltaMillis) {
  // move the shot
  var actualMoveSpeed = timeDeltaMillis * Encounter.SHOT_SPEED;
  this.translateZ(-actualMoveSpeed);
  this.hasTravelled += actualMoveSpeed;

  if (physics.debug)
  {
    // unhighlight the old closest obelisk
    physics.unHighlightObelisk(this.closeObeliskIndex.x, this.closeObeliskIndex.y);
  }

  // expire an aging shot based on distance travelled
  if (this.hasTravelled > Shot.CAN_TRAVEL)
  {
    this.cleanUpDeadShot();
  }
  else
  {
    this.collideWithObelisks();
    this.collideWithShips();
  }
}

Shot.prototype.callbackWhenDead = function(callback) {
  this.deadCallback = callback;
}

// A ShotSpawner is a visible Mesh that generates a bunch of Shots

ShotSpawner.prototype = Object.create(THREE.Mesh.prototype); // inheritance style from THREE
// location is a Vector3 placement for the spawner
function ShotSpawner(location) {
  THREE.Mesh.call(this, Shot.GEOMETRY, MATS.red); // super constructor
  this.SHOT_INTERVAL_MILLIS = 100;
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