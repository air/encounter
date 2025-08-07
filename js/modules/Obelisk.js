'use strict';

import * as C64 from './C64.js';

export const HEIGHT = 100;
export const RADIUS = 40;

// CLAUDE-TODO: Access THREE.js via window.THREE until THREE.js is properly modularized
// topRadius, bottomRadius, height, segments, heightSegments
export const GEOMETRY = new window.THREE.CylinderGeometry(RADIUS, RADIUS, HEIGHT, 12, 1, false);

// default to white material to test that color is loaded from Level data
export const MATERIAL = new window.THREE.MeshBasicMaterial({ color: C64.white });

// return a Mesh for a single Obelisk. Grid manages merging these into a single geometry.
export function newMeshInstance(position) {
  var mesh = new window.THREE.Mesh(GEOMETRY, MATERIAL);
  if (position)
  {
    mesh.position.copy(position);
  }
  return mesh;
}

// Export default object for backward compatibility
export default {
  HEIGHT,
  RADIUS,
  GEOMETRY,
  MATERIAL,
  newMeshInstance
};