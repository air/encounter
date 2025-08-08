'use strict';

import * as C64 from './C64.js';
import { convertSixDigitCssRgbToNumeric, TO_RADIANS } from './UTIL.js';
import Display from './Display.js';

// CLAUDE-TODO: These dependencies should be imported from their respective modules when converted
const Grid = {
  SIZE_SQUARE: 10000,  // placeholder value
  mesh: {
    add: (object) => console.log('Grid.mesh.add called with Ground')
  },
  addToScene: () => console.log('Grid.addToScene called')
};

// Ground plane setup - initially a default mesh, we'll define this in init()
const groundMesh = new window.THREE.Mesh(); // initially a default mesh, we'll define this in init()

// The Ground plane is faked but we can turn on a real one if need be - looks better in e.g. flight mode.
export const DO_RENDER = false;

// ground plane. Lots of segments will KILL your fps
export const X_SEGMENTS = 1;
export const Z_SEGMENTS = 1;
let GEOMETRY = null; // can't create until we know the Grid size, which is based on draw distance

// default to white in order to test that color is loaded from Level data
export const MATERIAL = new window.THREE.MeshBasicMaterial({ color: C64.white });

export function init() {
  if (!DO_RENDER) {
    return;
  }

  GEOMETRY = new window.THREE.PlaneGeometry(Grid.SIZE_SQUARE, Grid.SIZE_SQUARE, X_SEGMENTS, Z_SEGMENTS);

  // actually set up this Mesh using our materials
  window.THREE.Mesh.call(groundMesh, GEOMETRY, MATERIAL); 
  
  // plane inits as a wall on X axis facing the positive Z space, turn away to make a floor
  groundMesh.rotation.x = -90 * TO_RADIANS;

  // plane is anchored at its centre
  groundMesh.position.x = Grid.SIZE_SQUARE / 2;
  groundMesh.position.z = Grid.SIZE_SQUARE / 2;

  // zero Y is ground
  groundMesh.position.y = 0;

  // Ground is a child Object3D of the Grid. All movement and on/off are handled in the Grid API.
  Grid.mesh.add(groundMesh);
  Grid.addToScene();
}

// Pass a CSS colour string, e.g. C64.css.white
export function setColor(cssColor) {
  if (DO_RENDER) {
    var numericColor = convertSixDigitCssRgbToNumeric(cssColor);
    groundMesh.material.color = new window.THREE.Color(numericColor);
  } else {
    Display.groundDiv.style.backgroundColor = cssColor;
  }
}

// Getters for module state
export function getGeometry() { return GEOMETRY; }
export function getGroundMesh() { return groundMesh; }

// Export default object for backward compatibility
export default {
  DO_RENDER,
  X_SEGMENTS,
  Z_SEGMENTS,
  MATERIAL,
  get GEOMETRY() { return GEOMETRY; },
  init,
  setColor,
  getGeometry,
  getGroundMesh
};