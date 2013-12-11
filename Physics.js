// FIXME don't move the shot out by the shortest path (worst case: sideways), retrace the direction. This will break the 'movement as normal' idea
// FIXME Physics and physics is confusing, don't instantiate

Physics = function()
{
  // Pass a Vector3 and the radius of the object - does this sphere approach a collision with an Obelisk?
  // Uses a 2D rectangular bounding box check using modulus.
  Physics.prototype.isCloseToAnObelisk = function(position, radius)
  {
    if (typeof radius === "undefined") throw('required: radius');
    // special case for out of bounds
    if (position.x > Grid.MAX_X || position.x < 0) return false;
    if (position.z > Grid.MAX_Z || position.z < 0) return false;
    // special case for too high (fly mode only)
    if (position.y > (Obelisk.HEIGHT + radius)) return false;
    // special case for too low (fly mode only)
    if (position.y < -radius) return false;

    var collisionThreshold = Obelisk.RADIUS + radius; // must be this close together to touch
    var collisionMax = Grid.SPACING - collisionThreshold; // getting close to next Z line (obelisk)

    var distanceBeyondZLine = position.x % Grid.SPACING;
    // if we're further past than the radius sum, and not yet up to the next line minus that sum, we're safe
    if (distanceBeyondZLine > collisionThreshold && distanceBeyondZLine < collisionMax) return false;

    var distanceBeyondXLine = position.z % Grid.SPACING;
    if (distanceBeyondXLine > collisionThreshold && distanceBeyondXLine < collisionMax) return false;

    return true;
  };

  // pass a Vector3, return a Vector2
  Physics.prototype.getClosestObelisk = function(position)
  {
    var xPos = Math.round(position.x / Grid.SPACING);
    xPos = THREE.Math.clamp(xPos, 0, Grid.SIZE_X-1);

    var zPos = Math.round(position.z / Grid.SPACING);
    zPos = THREE.Math.clamp(zPos, 0, Grid.SIZE_Z-1);

    return new THREE.Vector2(xPos, zPos);
  };

  Physics.prototype.highlightObelisk = function(x, z, scale) {
    //Grid.rows[z][x].material = MATS.red;
    Grid.rows[z][x].scale.set(1, scale, 1);
  };

  Physics.prototype.unHighlightObelisk = function(x, z) {
    //Grid.rows[z][x].material = MATS.normal;
    Grid.rows[z][x].scale.set(1, 1, 1);
  };

  // pass in a Vector3 and radius that might be colliding with an Obelisk.
  // Y axis is ignored.
  // Performs 2D circle intersection check. Returns the colliding Obelisk object, or undefined if not colliding.
  Physics.prototype.getCollidingObelisk = function(position, radius)
  {
    // collision overlap must exceed a small epsilon so we don't count rounding errors
    var COLLISION_EPSILON = 0.01;

    // ignore the Y position
    var position2d = new THREE.Vector2(position.x, position.z);

    // now the obelisk. First the grid index as a Vector2
    var obPosition = this.getClosestObelisk(position, radius);
    // then the object
    var obeliskObject = Grid.rows[obPosition.y][obPosition.x];
    // then the 2D component
    var obelisk2d = new THREE.Vector2(obeliskObject.position.x, obeliskObject.position.z);

    var collisionThreshold = Obelisk.RADIUS + radius - COLLISION_EPSILON; // centres must be this close together to touch
    if (obelisk2d.distanceTo(position2d) < collisionThreshold) {
      return obeliskObject;
    } else {
      return undefined;
    }
  };

  // pass in two Vector3s and their radii. Y axis is ignored.
  Physics.prototype.doCirclesCollide = function(position1, radius1, position2, radius2)
  {
    // collision overlap must exceed a small epsilon so we don't count rounding errors
    var COLLISION_EPSILON = 0.01;
    var collisionThreshold = radius1 + radius2 - COLLISION_EPSILON; // centres must be this close together to touch
    var distance = new THREE.Vector2(position1.x, position1.z).distanceTo(new THREE.Vector2(position2.x, position2.z));    
    return (distance < collisionThreshold);
  }

  // Collide a moving Object3D with a static point and radius. The object position and rotation will be modified.
  // object must have a .RADIUS
  Physics.prototype.bounceObjectOutOfIntersectingCircle = function(staticPoint, staticRadius, object)
  {
    if (typeof object.RADIUS === "undefined") throw('object must have RADIUS');

    // move collider out of the obelisk, get the movement that was executed
    var movement = physics.moveCircleOutOfStaticCircle(staticPoint, staticRadius, object.position, object.RADIUS);

    // the movement that was executed is the surface normal of the obelisk as the object hits it
    movement.normalize();

    // Let the unit vector in the direction that the object hits the rigid surface be V.
    // Let the unit normal of the surface be N.
    // Then, the vector after collision R = V - 2 * N.V * N
    // or V + 2N((-V).N)

    var N = movement;
    var V = physics.objectRotationAsUnitVector(object);
    // get the scalar values
    var NdotV = N.dot(V);
    var twoNdotV = 2 * NdotV;
    // now multiply the vector, which is awkward given all vecmath methods are destructive
    var NbyTwoNdotV = N.clone(); // otherwise N gets changed by the multiplication
    NbyTwoNdotV.multiplyScalar(twoNdotV);
    var result = V.clone(); // clone otherwise V is changed in the final subtraction
    result.subVectors(V, NbyTwoNdotV);

    // apply the result to the object: convert the unit vector back to rotation
    var newRotation = physics.vectorToRotation(result);
    object.rotation.y = newRotation;
  };

  // pass in two Vector2s, returns a Vector2
  Physics.prototype.lineMidpoint = function(p1, p2)
  {
    var  x, y, dx, dy;
    x = Math.min(p1.x, p2.x) + Math.abs( (p1.x - p2.x) / 2 );
    y = Math.min(p1.y, p2.y) + Math.abs( (p1.y - p2.y) / 2 );
    return new THREE.Vector2(x, y);
  };

  // Pass an object with a .rotation, or a Vector3. Will mod 360.
  // Note the axes: 0 is negative along Z axis, and it turns anticlockwise from there, so:
  // 90 along negative X axis
  // 180 along positive Z axis
  // -90 along positive X axis
  Physics.prototype.yRotationToDegrees = function(object)
  {
    if (typeof object.rotation === "undefined") {
      return (object.y * TO_DEGREES) % 360;
    } else {
      return (object.rotation.y * TO_DEGREES) % 360;
    }
  };

  // pass in an object3D, get the .rotation as the unit vector of X and Z
  Physics.prototype.objectRotationAsUnitVector = function(object)
  {
    // 1. sin expects radians
    // 2. have to adjust the signs to match three.js orientation
    var xComponent = -Math.sin(object.rotation.y);
    var zComponent = -Math.cos(object.rotation.y);
    var vector = new THREE.Vector3(xComponent, 0, zComponent);
    return vector.normalize();
  }

  // pass in a Vector3 with X and Z values, get the rotation in radians, suitable for object.rotation.y
  // Note the axes: 0 is negative along Z axis, and it turns anticlockwise from there, so:
  // 90 along negative X axis
  // 180 along positive Z axis
  // -90 along positive X axis
  Physics.prototype.vectorToRotation = function(vector)
  {
    // we need atan2 to get all quadrants
    // atan2 rotates to the X axis (+Z for us) - so invert the values to get a rotation to -Z axis
    return Math.atan2(-vector.x, -vector.z);
  }

  // Pass in two Vector3 positions, which intersect in the X-Z plane given a radius for each.
  // This function will move the second position out of the first by the shortest path (again on the X-Z plane).
  // All Y values are ignored.
  // Points = Vector3s
  // Radius = radius of the circles on the X-Z plane
  // Returns a Vector3 containing the movement executed, in case that's useful. Y will be zero.
  Physics.prototype.moveCircleOutOfStaticCircle = function(staticPoint, staticRadius, movingPoint, movingRadius)
  {
    if (typeof staticPoint.x === "undefined") throw('staticPoint must have an x, wrong type?');
    if (typeof movingPoint.x === "undefined") throw('movingPoint must have an x, wrong type?');

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

    movingPoint.add(movement);

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