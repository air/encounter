// FIXME don't move the shot out by the shortest path (worst case: sideways), retrace the direction. This will break the 'movement as normal' idea

// FIXME isNormal -> isUnit or isNormalized, confusing terminology

EncounterPhysics = function() {

  // Pass a Vector3 and the radius of the object
  // A 2D rectangular bounding box check using modulus
  EncounterPhysics.prototype.isCloseToAnObelisk = function(position, radius) {
    if (typeof radius === "undefined") throw('required: radius');
    // special case for out of bounds
    if (position.x > OB.MAX_X || position.x < 0) return false;
    if (position.z > OB.MAX_Z || position.z < 0) return false;

    var collisionThreshold = OB.radius + radius; // must be this close together to touch
    var collisionMax = OB.spacing - collisionThreshold; // getting close to next Z line (obelisk)

    var distanceBeyondZLine = position.x % OB.spacing;
    // if we're further past than the radius sum, and not yet up to the next line minus that sum, we're safe
    if (distanceBeyondZLine > collisionThreshold && distanceBeyondZLine < collisionMax) return false;

    var distanceBeyondXLine = position.z % OB.spacing;
    if (distanceBeyondXLine > collisionThreshold && distanceBeyondXLine < collisionMax) return false;

    return true;
  };

  // pass a Vector3, return a Vector2
  EncounterPhysics.prototype.getClosestObelisk = function(position) {
    var xPos = Math.round(position.x / OB.spacing);
    xPos = THREE.Math.clamp(xPos, 0, OB.gridSizeX-1);

    var zPos = Math.round(position.z / OB.spacing);
    zPos = THREE.Math.clamp(zPos, 0, OB.gridSizeZ-1);

    return new THREE.Vector2(xPos, zPos);
  };

  EncounterPhysics.prototype.highlightObelisk = function(x, z, scale) {
    //OB.rows[z][x].material = MATS.red;
    OB.rows[z][x].scale.set(1, scale, 1);
  };

  EncounterPhysics.prototype.unHighlightObelisk = function(x, z) {
    //OB.rows[z][x].material = MATS.normal;
    OB.rows[z][x].scale.set(1, 1, 1);
  };

  // pass in a Vector3. Performs 2D circle intersection check. Returns undefined if not colliding
  EncounterPhysics.prototype.getCollidingObelisk = function(position, radius) {
    // collision overlap must exceed a small epsilon so we don't count rounding errors
    var COLLISION_EPSILON = 0.01;

    // ignore the Y position
    var position2d = new THREE.Vector2(position.x, position.z);

    // now the obelisk. First the grid index as a Vector2
    var obPosition = this.getClosestObelisk(position, radius);
    // then the object
    var obeliskObject = OB.rows[obPosition.y][obPosition.x];
    // then the 2D component
    var obelisk2d = new THREE.Vector2(obeliskObject.position.x, obeliskObject.position.z);

    var collisionThreshold = OB.radius + radius - COLLISION_EPSILON; // must be this close together to touch
    if (obelisk2d.distanceTo(position2d) < collisionThreshold) {
      return obeliskObject;
    } else {
      return undefined;
    }
  };

  // FIXME look at the direct bounce back case first - not happening
  // object must have a .radius
  EncounterPhysics.prototype.collideWithObelisk = function(obelisk, object) {
    if (typeof object.radius === "undefined") throw('object must have radius');

    // move collider out of the obelisk, get the movement that was executed
    var movement = physics.moveCircleOutOfStaticCircle(obelisk.position, OB.radius, object.position, object.radius);

    // the movement that was executed is the surface normal of the obelisk as the object hits it
    movement.normalize();

    // Let the unit vector in the direction that the object hits the rigid surface be V.
    // Let the unit normal of the surface be N.
    // Then, the vector after collision R = V - 2 * N.V * N

    // or V + 2N((-V).N)

    var N = movement;
    var V = physics.objectRotationAsUnitVector(object);
    // get the scalar valuess
    var NdotV = N.dot(V);
    var twoNdotV = 2 * NdotV;
    // now multiply the vector, which is awkward given all vecmath methods are destructive
    var NbyTwoNdotV = N.clone(); // otherwise N gets changed by the multiplication
    NbyTwoNdotV.multiplyScalar(twoNdotV);
    var result = V.clone(); // clone otherwise V is changed in the final subtraction
    result.sub(V, NbyTwoNdotV);

    // apply the result to the object: convert the unit vector back to rotation
    var newRotation = physics.unitVectorToRotation(result);
    object.rotation.y = newRotation;
  };

  // pass in two Vector2s, returns a Vector2
  EncounterPhysics.prototype.lineMidpoint = function(p1, p2)
  {
    var  x, y, dx, dy;
    x = Math.min(p1.x, p2.x) + Math.abs( (p1.x - p2.x) / 2 );
    y = Math.min(p1.y, p2.y) + Math.abs( (p1.y - p2.y) / 2 );
    return new THREE.Vector2(x, y);
  };

  // Pass an object with a .radius, or a Vector3. Will mod 360.
  // Worth documenting the axes: 0 is negative along Z axis, and it turns anticlockwise from there, so:
  // 90 along negative X axis
  // 180 along positive Z axis
  // -90 along positive X axis
  EncounterPhysics.prototype.yRotationToDegrees = function(object)
  {
    if (typeof object.rotation === "undefined") {
      return (object.y * TO_DEGREES) % 360;
    } else {
      return (object.rotation.y * TO_DEGREES) % 360;
    }
  };

  // pass in an object3D, get the .rotation as the unit vector of X and Z
  EncounterPhysics.prototype.objectRotationAsUnitVector = function(object) {
    // 1. sin expects radians
    // 2. have to adjust the signs to match three.js orientation
    var xComponent = -Math.sin(object.rotation.y);
    var zComponent = -Math.cos(object.rotation.y);
    var vector = new THREE.Vector3(xComponent, 0, zComponent);
    return vector.normalize();
  }

  // pass in a unit Vector3 with X and Z values, get the Y rotation in radians
  // TODO technically we don't have to care if it's unit or not?
  EncounterPhysics.prototype.unitVectorToRotation = function(vector) {
    if (!MY3.isNormal(vector)) throw('must be a unit vector, length: ' + vector.length());
    // 1. we have all three sides (hypotenuse=1 in a unit vector) so only one component needed
    // 2. have to adjust the signs to match three.js orientation
    return -Math.asin(vector.x);
  }

  // Pass in two Vector3 positions, which intersect in the X-Z plane given a radius for each.
  // This function will move the second position out of the first by the shortest path (again on the X-Z plane).
  // All Y values are ignored.
  // Points = Vector3s
  // Radius = radius of the circles on the X-Z plane
  // Returns a Vector3 containing the movement executed, in case that's useful. Y will be zero.
  EncounterPhysics.prototype.moveCircleOutOfStaticCircle = function(staticPoint, staticRadius, movingPoint, movingRadius)
  {
    // move the circle a tiny bit further than required, to account for rounding
    var MOVE_EPSILON = 0.000001;
    var staticPoint2d = new THREE.Vector2(staticPoint.x, staticPoint.z);
    var movingPoint2d = new THREE.Vector2(movingPoint.x, movingPoint.z);

    // sanity check
    var centreDistance = staticPoint2d.distanceTo(movingPoint2d); // careful to ignore Ys here
    var distanceBetweenEdges = centreDistance - staticRadius - movingRadius;
    // if intersecting, this should be negative
    if (distanceBetweenEdges >= 0) {
      throw('no separation needed. Static ' + staticPoint + ' radius ' + staticRadius + ', moving ' + movingPoint + ' radius ' + movingRadius);
    }

    var moveDistance = -distanceBetweenEdges; // moving circle must go this far directly away from static

    // ratio of small triangle to big one. Add a small buffer distance
    var scale = (moveDistance / centreDistance) + MOVE_EPSILON;

    var movement = new THREE.Vector3();
    movement.x = (staticPoint.x - movingPoint.x) * -scale;
    movement.y = 0;
    movement.z = (staticPoint.z - movingPoint.z) * -scale;

    movingPoint.add(movingPoint, movement);

    movingPoint2d = new THREE.Vector2(movingPoint.x, movingPoint.z);

    // sanity check
    centreDistance = staticPoint2d.distanceTo(movingPoint2d); // again ignore the Ys
    distanceBetweenEdges = centreDistance - staticRadius - movingRadius;
    if (distanceBetweenEdges < 0) {
      throw('separation failed, distance between edges ' + distanceBetweenEdges);
    }

    return movement;
  };

};