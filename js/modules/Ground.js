'use strict';

import * as C64 from './C64.js';
import { convertSixDigitCssRgbToNumeric, TO_RADIANS } from './UTIL.js';
import Display from './Display.js';
import { getSizeSquare, mesh as Grid_mesh, addToScene as Grid_addToScene } from './Grid.js';

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

  GEOMETRY = new window.THREE.PlaneGeometry(getSizeSquare(), getSizeSquare(), X_SEGMENTS, Z_SEGMENTS);

  // actually set up this Mesh using our materials
  window.THREE.Mesh.call(groundMesh, GEOMETRY, MATERIAL);

  // plane inits as a wall on X axis facing the positive Z space, turn away to make a floor
  groundMesh.rotation.x = -90 * TO_RADIANS;

  // plane is anchored at its centre
  groundMesh.position.x = getSizeSquare() / 2;
  groundMesh.position.z = getSizeSquare() / 2;

  // zero Y is ground
  groundMesh.position.y = 0;

  // Ground is a child Object3D of the Grid. All movement and on/off are handled in the Grid API.
  Grid_mesh.add(groundMesh);
  Grid_addToScene();
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

// Export default object for backward compatibility
export default {
  DO_RENDER,
  X_SEGMENTS,
  Z_SEGMENTS,
  MATERIAL,
  get GEOMETRY() { return GEOMETRY; },
  init,
  setColor
};