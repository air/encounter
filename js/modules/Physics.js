'use strict';

import * as Obelisk from './Obelisk.js';
import * as Grid from './Grid.js';
import * as MY3 from './MY3.js';

/**
 * Physics module - Collision detection and response for game objects
 * Handles 2D collision detection on the X-Z plane for obelisks and game objects
 */

/**
 * Fast bounding box check to determine if an object might collide with an obelisk
 * Uses modulus-based grid checking for efficient broad-phase collision detection
 * 
 * @param {THREE.Vector3} position - The position to check
 * @param {number} radius - The radius of the object at this position
 * @returns {boolean} True if the object is close enough to require detailed collision checking
 * @throws {Error} If radius is undefined
 */
export function isCloseToAnObelisk(position, radius) {
  if (radius === undefined)
  {
    throw new Error('required: radius');
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

/**
 * Precise circle-to-circle collision check in 2D (ignores Y axis)
 * 
 * @param {THREE.Vector3} position - Position to check for collision (Y ignored)
 * @param {number} radius - Radius of the object
 * @returns {THREE.Vector3|undefined} Position of colliding obelisk, or undefined if no collision
 */
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

/**
 * Bounce a moving object off a static circular obstacle using physics reflection
 * Modifies the object's position and rotation based on collision response
 * 
 * @param {THREE.Vector3} staticPoint - Position of static obstacle
 * @param {number} staticRadius - Radius of static obstacle
 * @param {THREE.Object3D} object - Moving object that collided (will be modified)
 * @param {number} objectRadius - Radius of moving object
 */
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

/**
 * Separate two overlapping circles by moving one out of the other
 * Works in 2D on the X-Z plane (Y values are ignored)
 * 
 * @param {THREE.Vector3} staticPoint - Position of static circle (not modified)
 * @param {number} staticRadius - Radius of static circle
 * @param {THREE.Vector3} movingPoint - Position of moving circle (will be modified)
 * @param {number} movingRadius - Radius of moving circle
 * @returns {THREE.Vector3} Vector representing the movement executed (Y will be zero)
 * @throws {Error} If points are invalid or not intersecting
 */
export function moveCircleOutOfStaticCircle(staticPoint, staticRadius, movingPoint, movingRadius) {
  if (staticPoint.x === undefined)
  {
    throw new Error('staticPoint must have an x, wrong type?');
  }
  if (movingPoint.x === undefined)
  {
    throw new Error('movingPoint must have an x, wrong type?');
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
    throw new Error('no separation needed. Static ' + staticPoint.x + ',' + staticPoint.z + ' radius ' + staticRadius + ', moving ' + movingPoint.x + ',' + movingPoint.z + ' radius ' + movingRadius);
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
    throw new Error('separation failed, distance between edges ' + distanceBetweenEdges);
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