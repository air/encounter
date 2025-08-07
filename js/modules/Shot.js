'use strict';

import * as C64 from './C64.js';
import * as MY3 from './MY3.js';
import * as Physics from './Physics.js';
import * as Obelisk from './Obelisk.js';
import Sound from './Sound.js';

export const RADIUS = 3;
export const HEIGHT = 6;
// radius, height, segments, heightSegments
export const GEOMETRY = new window.THREE.CylinderGeometry(RADIUS, RADIUS, HEIGHT, 8, 1, false);
export const MATERIAL = new window.THREE.MeshBasicMaterial({ color : C64.white });

let shotType = null; // 'player' or 'enemy' // FIXME use constants instead of literals
let speed = 1.5; // default
let direction = null; // will be updated by the firer

// move the shot forward by (speed * timeDeltaMillis) in the direction it's pointing
export function update(timeDeltaMillis) {
  // FIXME direction should always be normalised because a non-normalized direction modifies the length of the move
  if (this.direction !== null && this.direction !== undefined)
  {
    var movement = this.direction.clone();
    movement.multiplyScalar(this.speed * timeDeltaMillis);
    this.position.add(movement);
  }

  // bounce off obelisks
  if (Physics.isCollidingWithObelisk(this.position, RADIUS))
  {
    Sound.shotBounce();
    Physics.bounceObjectOutOfIntersectingCircle(
      Physics.isCollidingWithObelisk(this.position, RADIUS),
      Obelisk.RADIUS, this, RADIUS);

    // recalculate direction after bouncing, to support further collisions on the same frame
    this.direction = MY3.objectRotationAsUnitVector(this);
  }
}

// return a Mesh for a single Shot
export function newMeshInstance(position, directionVector) {
  var mesh = new window.THREE.Mesh(GEOMETRY, MATERIAL);
  if (position)
  {
    mesh.position.copy(position);
  }

  // copy the Shot functions onto the mesh
  mesh.update = update;
  mesh.direction = directionVector.clone(); // FIXME it's the caller's responsibility to ensure this is normalised
  mesh.speed = speed;

  return mesh;
}

// Getters and setters for module state
export function getShotType() { return shotType; }
export function setShotType(type) { shotType = type; }
export function getSpeed() { return speed; }
export function setSpeed(newSpeed) { speed = newSpeed; }
export function getDirection() { return direction; }
export function setDirection(newDirection) { direction = newDirection; }

// Export default object for backward compatibility
export default {
  RADIUS,
  HEIGHT,
  GEOMETRY,
  MATERIAL,
  shotType: () => shotType,
  speed: () => speed,
  direction: () => direction,
  update,
  newMeshInstance,
  getShotType,
  setShotType,
  getSpeed,
  setSpeed,
  getDirection,
  setDirection
};