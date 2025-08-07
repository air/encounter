'use strict';

import * as Obelisk from './Obelisk.js';

import * as MY3 from './MY3.js';

// CLAUDE-TODO: These dependencies should be imported from their respective modules when converted
const Grid = {
  SPACING: 200 // Placeholder value - should match original
};

// FIXME don't move the shot out by the shortest path (worst case: sideways), retrace the direction. This will break the 'movement as normal' idea

// Pass a Vector3 and the radius of the object - does this sphere approach a collision with an Obelisk?
// Uses a 2D rectangular bounding box check using modulus.
export function isCloseToAnObelisk(position, radius) {
  if (radius === undefined)
  {
    throw('required: radius');
  }
  // special case for too high (fly mode only)
  if (position.y > (Obelisk.HEIGHT + radius))
  {
    return false;
  }
  // special case for too low (fly mode only)
  if (position.y < -radius)
  {
    return false;
  }

  var collisionThreshold = Obelisk.RADIUS + radius; // must be this close together to touch
  var collisionMax = Grid.SPACING - collisionThreshold; // getting close to next Z line (obelisk)

  var distanceBeyondZLine = position.x % Grid.SPACING;
  // if we're further past than the radius sum, and not yet up to the next line minus that sum, we're safe
  if (distanceBeyondZLine > collisionThreshold && distanceBeyondZLine < collisionMax)
  {
    return false;
  }

  var distanceBeyondXLine = position.z % Grid.SPACING;
  if (distanceBeyondXLine > collisionThreshold && distanceBeyondXLine < collisionMax)
  {
    return false;
  }

  return true;
}

// Pass in a Vector3 (Y is ignored!) and radius that might be colliding with an Obelisk. Performs 2D circle intersection check.
// Returns a Vector3 position for a colliding Obelisk, or undefined if not colliding.
export function isCollidingWithObelisk(position, radius) {
  // collision overlap must exceed a small epsilon so we don't count rounding errors
  var COLLISION_EPSILON = 0.01;

  // Get the position of the closest obelisk: divide X into grid intervals, round, then multiply back to absolute position
  var closestObeliskX = Math.round(position.x / Grid.SPACING) * Grid.SPACING;
  var closestObeliskZ = Math.round(position.z / Grid.SPACING) * Grid.SPACING;
  // assume obelisk is on the same Y plane as the given position, so we get a pure 2D distance
  var obeliskPosition = new window.THREE.Vector3(closestObeliskX, position.y, closestObeliskZ);

  var collisionThreshold = Obelisk.RADIUS + radius - COLLISION_EPSILON; // centres must be this close together to touch
  if (obeliskPosition.distanceTo(position) < collisionThreshold)
  {
    return obeliskPosition;
  }
  else
  {
    return undefined;
  }
}

// Collide a moving Object3D with a static point and radius. The object position and rotation will be modified.
export function bounceObjectOutOfIntersectingCircle(staticPoint, staticRadius, object, objectRadius) {
  // move collider out of the obelisk, get the movement that was executed
  var movement = moveCircleOutOfStaticCircle(staticPoint, staticRadius, object.position, objectRadius);

  // the movement that was executed is the surface normal of the obelisk as the object hits it
  movement.normalize();

  // Let the unit vector in the direction that the object hits the rigid surface be V.
  // Let the unit normal of the surface be N.
  // Then, the vector after collision R = V - 2 * N.V * N
  // or V + 2N((-V).N)

  var N = movement;
  var V = MY3.objectRotationAsUnitVector(object);
  // get the scalar values
  var NdotV = N.dot(V);
  var twoNdotV = 2 * NdotV;
  // now multiply the vector, which is awkward given all vecmath methods are destructive
  var NbyTwoNdotV = N.clone(); // otherwise N gets changed by the multiplication
  NbyTwoNdotV.multiplyScalar(twoNdotV);
  var result = V.clone(); // clone otherwise V is changed in the final subtraction
  result.subVectors(V, NbyTwoNdotV);

  // apply the result to the object: convert the unit vector back to rotation
  var newRotation = MY3.vectorToRotation(result);
  object.rotation.y = newRotation;
}

// Pass in two Vector3 positions, which intersect in the X-Z plane given a radius for each.
// This function will move the second position out of the first by the shortest path (again on the X-Z plane).
// All Y values are ignored.
// Points = Vector3s
// Radius = radius of the circles on the X-Z plane
// Returns a Vector3 containing the movement executed, in case that's useful. Y will be zero.
export function moveCircleOutOfStaticCircle(staticPoint, staticRadius, movingPoint, movingRadius) {
  if (staticPoint.x === undefined)
  {
    throw('staticPoint must have an x, wrong type?');
  }
  if (movingPoint.x === undefined)
  {
    throw('movingPoint must have an x, wrong type?');
  }

  // move the circle a tiny bit further than required, to account for rounding
  var MOVE_EPSILON = 0.000001;
  var staticPoint2d = new window.THREE.Vector2(staticPoint.x, staticPoint.z);
  var movingPoint2d = new window.THREE.Vector2(movingPoint.x, movingPoint.z);

  // sanity check
  var centreDistance = staticPoint2d.distanceTo(movingPoint2d); // careful to ignore Ys here
  var distanceBetweenEdges = centreDistance - staticRadius - movingRadius;
  // if intersecting, this should be negative
  if (distanceBetweenEdges >= 0)
  {
    throw('no separation needed. Static ' + staticPoint.x + ',' + staticPoint.z + ' radius ' + staticRadius + ', moving ' + movingPoint.x + ',' + movingPoint.z + ' radius ' + movingRadius);
  }

  var moveDistance = -distanceBetweenEdges; // moving circle must go this far directly away from static

  // ratio of small triangle to big one. Add a small buffer distance
  var scale = (moveDistance / centreDistance) + MOVE_EPSILON;

  var movement = new window.THREE.Vector3();
  movement.x = (staticPoint.x - movingPoint.x) * -scale;
  movement.y = 0;
  movement.z = (staticPoint.z - movingPoint.z) * -scale;

  movingPoint.add(movement);

  movingPoint2d = new window.THREE.Vector2(movingPoint.x, movingPoint.z);

  // sanity check
  centreDistance = staticPoint2d.distanceTo(movingPoint2d); // again ignore the Ys
  distanceBetweenEdges = centreDistance - staticRadius - movingRadius;
  if (distanceBetweenEdges < 0)
  {
    throw('separation failed, distance between edges ' + distanceBetweenEdges);
  }

  return movement;
}

// Export default object for backward compatibility
export default {
  isCloseToAnObelisk,
  isCollidingWithObelisk,
  bounceObjectOutOfIntersectingCircle,
  moveCircleOutOfStaticCircle
};