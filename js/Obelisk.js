import { log, error, panic } from '/js/UTIL.js';
import * as THREE from '/lib/three.module.js';
import * as C64 from '/js/C64.js';

export const HEIGHT = 100;
export const RADIUS = 40;
// topRadius, bottomRadius, height, segments, heightSegments
export const GEOMETRY = new THREE.CylinderGeometry(RADIUS, RADIUS, HEIGHT, 12, 1, false);
// default to white material to test that color is loaded from Level data
export const MATERIAL = new THREE.MeshBasicMaterial({ color: C64.white });

// return a Mesh for a single Obelisk. Grid manages merging these into a single geometry.
export function newMeshInstance(position)
{
  var mesh = new THREE.Mesh(GEOMETRY, MATERIAL);
  if (position)
  {
    mesh.position.copy(position);
  }
  return mesh;
}
