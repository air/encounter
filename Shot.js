// Player or enemy shot

Shot.prototype = Object.create(THREE.Mesh.prototype); // inheritance style from THREE
function Shot(firingObject) {
  THREE.Mesh.call(this, SHOT.geometry, SHOT.material); // super constructor

  this.position.copy(firingObject.position);
  this.rotation.copy(firingObject.rotation);
  this.updateMatrix(); // push the position/rotation changes into the underlying matrix
  this.translateZ(-SHOT.offset); // this depends on the matrix being up to date
  this.isDead = false;
  this.hasTravelled = 0;
  this.radius = SHOT.radius;
  this.closeObeliskIndex = new THREE.Vector2(0,0);
}

Shot.prototype.update = function(t) {
  // move
  var actualMoveSpeed = t * ENCOUNTER.shotSpeed;
  this.translateZ(-actualMoveSpeed);
  this.hasTravelled += actualMoveSpeed;

  // unhighlight the old closest obelisk
  physics.unHighlightObelisk(this.closeObeliskIndex.x, this.closeObeliskIndex.y);

  // if an obelisk is close (fast check), highlight it to a small degree and do further collision checks
  if (physics.isCloseToAnObelisk(this.position, SHOT.radius)) {
    // check for precise collision
    var obelisk = physics.getCollidingObelisk(this.position, SHOT.radius);
    if (typeof obelisk !== "undefined") {
      // we have a collision, bounce
      physics.bounceObjectOutOfIntersectingCircle(obelisk.position, OB.radius, this);
      sound.shotBounce();
      physics.highlightObelisk(this.closeObeliskIndex.x, this.closeObeliskIndex.y, 6);
    } else {
      // otherwise a near miss, highlight a little to visually notify
      physics.highlightObelisk(this.closeObeliskIndex.x, this.closeObeliskIndex.y, 2);
    }
  }

  // always need to know the closest for drawing the debug line
  this.closeObeliskIndex = physics.getClosestObelisk(this.position);

  // kill old line and add a new one
  scene.remove(this.line);
  scene.remove(this.pointer);

  // get the obelisk object itself to read its position
  var obelisk = OB.rows[this.closeObeliskIndex.y][this.closeObeliskIndex.x];
  this.line = new MY3.Line(this.position, obelisk.position);
  // FIXME - broken
  this.pointer = new MY3.Pointer(this.position, physics.objectRotationAsUnitVector(this), 200);
  scene.add(this.line);
  scene.add(this.pointer);

  if (this.hasTravelled > SHOT.canTravel) {
    this.isDead = true;
    scene.remove(this.line);
    scene.remove(this.pointer);
    physics.unHighlightObelisk(this.closeObeliskIndex.x, this.closeObeliskIndex.y);
  }
  if (this.isDead) {
    this.deadCallback.apply(undefined, [this]); // just pass reference to this actor
  }
}

Shot.prototype.callbackWhenDead = function(callback) {
  this.deadCallback = callback;
}
