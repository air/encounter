import { log, error, panic, TO_RADIANS, convertSixDigitCssRgbToNumeric } from '/js/UTIL.js';
import * as THREE from '/lib/three.module.js'
import * as C64 from '/js/C64.js'
import * as Display from '/js/Display.js'
import * as Grid from '/js/Grid.js'

export var groundObject = new THREE.Mesh(); // initially a default mesh, we'll define this in init()

// The Ground plane is faked but we can turn on a real one if need be - looks better in e.g. flight mode.
export var DO_RENDER = false;

// ground plane. Lots of segments will KILL your fps
export const X_SEGMENTS = 1;
export const Z_SEGMENTS = 1;
export var GEOMETRY = null; // can't create until we know the Grid size, which is based on draw distance

// default to white in order to test that color is loaded from Level data
export var MATERIAL = new THREE.MeshBasicMaterial({ color : C64.white });

export function init()
{
  if (!DO_RENDER)
  {
    return;
  }

  GEOMETRY = new THREE.PlaneGeometry(Grid.SIZE_SQUARE, Grid.SIZE_SQUARE, X_SEGMENTS, Z_SEGMENTS);

  // actually set up this Mesh using our materials
  THREE.Mesh.call(groundObject, GEOMETRY, MATERIAL);

  // plane inits as a wall on X axis facing the positive Z space, turn away to make a floor
  groundObject.rotation.x = -90 * TO_RADIANS;

  // plane is anchored at its centre
  groundObject.position.x = Grid.SIZE_SQUARE / 2;
  groundObject.position.z = Grid.SIZE_SQUARE / 2;

  // zero Y is ground
  groundObject.position.y = 0;

  // Ground is a child Object3D of the Grid. All movement and on/off are handled in the Grid API.
  Grid.mesh.add(groundObject);
  Grid.addToScene();
};

// Pass a CSS colour string, e.g. C64.css.white
export function setColor(cssColor)
{
  if (DO_RENDER)
  {
    var numericColor = convertSixDigitCssRgbToNumeric(cssColor);
    material.color = new THREE.Color(numericColor);
  }
  else
  {
    Display.groundDiv.style.backgroundColor = cssColor;
  }
};
