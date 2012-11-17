// Player or enemy shot

Shot.prototype = Object.create(THREE.Mesh.prototype); // inheritance style from THREE
function Shot(firingObject) {
  THREE.Mesh.call(this, SHOT.geometry, SHOT.material); // super constructor

  this.position.copy(firingObject.position);
  this.rotation.copy(firingObject.rotation);
  this.updateMatrix(); // setting the rotation is not enough, translate acts on the underlying matrix
  this.translateZ(-SHOT.offset);
  this.isDead = false;
  this.hasTravelled = 0;
  this.closeObeliskIndex = new THREE.Vector2(0,0);
}

Shot.prototype.update = function(t) {
  // move
  var actualMoveSpeed = t * ENCOUNTER.shotSpeed;
  this.translateZ(-actualMoveSpeed);
  this.hasTravelled += actualMoveSpeed;

  // unhighlight the old closest obelisk
  physics.unHighlightObelisk(this.closeObeliskIndex.x, this.closeObeliskIndex.y);
  // if an obelisk is close, highlight it. If we're colliding, highlight it more
  if (physics.isCloseToAnObelisk(this.position, SHOT.radius)) {
    if (physics.isCollidingwithObelisk(this.position, SHOT.radius)) {
      physics.highlightObelisk(this.closeObeliskIndex.x, this.closeObeliskIndex.y, 6);
    } else {
      physics.highlightObelisk(this.closeObeliskIndex.x, this.closeObeliskIndex.y, 2);
    }
  }

  // always need to know the closest for drawing the debug line
  this.closeObeliskIndex = physics.getClosestObelisk(this.position);

  // kill old line and add a new one
  scene.remove(this.line);
  // get the obelisk object itself to read its position
  var obelisk = OB.rows[this.closeObeliskIndex.y][this.closeObeliskIndex.x];
  this.line = new MY3.Line(this.position, obelisk.position);
  scene.add(this.line);

  if (this.hasTravelled > SHOT.canTravel) {
    this.isDead = true;
    scene.remove(this.line);
    physics.unHighlightObelisk(this.closeObeliskIndex.x, this.closeObeliskIndex.y);
  }
  if (this.isDead) {
    this.deadCallback.apply(undefined, [this]); // just pass reference to this actor
  }
}

Shot.prototype.callbackWhenDead = function(callback) {
  this.deadCallback = callback;
}
