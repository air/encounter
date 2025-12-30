'use strict';

import { TO_DEGREES, panic } from './UTIL.js';

let threeDiv = null;  // div containing the renderer

//=============================================================================
// runtime environment
//=============================================================================
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const HALFWIDTH = window.innerWidth / 2;
const HALFHEIGHT = window.innerHeight / 2;

//=============================================================================
// constants
//=============================================================================
export const X_AXIS = new window.THREE.Vector3(1,0,0);
export const Y_AXIS = new window.THREE.Vector3(0,1,0);
export const Z_AXIS = new window.THREE.Vector3(0,0,1);

//=============================================================================
// global objects
//=============================================================================
// rendering objects
let renderer, camera, scene;

// timing - pass autoStart to start the clock the next time it's called
let clock = new window.THREE.Clock(true);
clock.multiplier = 1000; // expose this so we can manipulate it for fun times

//=============================================================================
// init functions
//=============================================================================
// optional argument: far - draw distance, defaults to 10,000
// optional argument: zIndex - for the div containing the canvas, defaults to 10
export function init3d(far, zIndex) {
  var VIEW_ANGLE = 45; // degrees not radians
  var ASPECT = WIDTH / HEIGHT;
  var NEAR = 0.1; // objects closer than this won't render
  var FAR = (far === undefined) ? 10000 : far;
  var theZIndex = (zIndex === undefined) ? 10 : zIndex;

  renderer = new window.THREE.WebGLRenderer({ alpha: true });
  camera = new window.THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene = new window.THREE.Scene();
  scene.add(camera);
  renderer.setSize(WIDTH, HEIGHT); // size of canvas element
  renderer.shadowMap.enabled = true;
  threeDiv = document.createElement('div');
  threeDiv.id = 'threejs';
  threeDiv.style.position = 'absolute';
  threeDiv.style.zIndex = theZIndex;
  threeDiv.appendChild(renderer.domElement); // adds canvas element
  document.body.appendChild(threeDiv);
}

export function addHelpers() {
  var axis = new window.THREE.AxesHelper(300);
  scene.add(axis);
  var camHelp = new window.THREE.CameraHelper(camera);
  scene.add(camHelp);
}

// Basic FPS counter from THREE
export function newThreeStats() {
  var STATS = new Stats();
  STATS.domElement.style.position = 'absolute';
  STATS.domElement.style.top = '';
  STATS.domElement.style.bottom = '0px';
  STATS.domElement.style.opacity = '0.5';
  document.body.appendChild(STATS.domElement);
  return STATS;
}

// Use a more advanced stats counter. Requires 'renderer' to exist
export function setupRStats() {
  // three.js plugin
  // threestats = new threeStats(renderer); // when restoring, don't forget plugins: below
  // FIXME I hacked rStats.extras.js to remove the alarm at 1000 renderer.info.render.faces

  // base rstats
  var settings = {
    CSSPath: 'lib/',
    values: {
      frame: { caption: 'Render time (ms)', over: 16 },
      fps: { caption: 'FPS', below: 30 },
      engine: { caption: 'Engine time (ms)', over: 5 }
    },
    groups: [ { caption: 'Performance', values: [ 'engine', 'frame', 'fps' ] } ],
    // plugins: [threestats]
  };
  rstats = new rStats(settings);
}

//=============================================================================
// core animation loop
//=============================================================================
export function render() {
  renderer.render(scene, camera);
}

// Optional update callback for the animation loop
let updateCallback = null;

// Set the update callback that will be called each frame
export function setUpdateCallback(callback) {
  updateCallback = callback;
}

// Main animation loop - calls optional update callback and render()
export function startAnimationLoop() {
  requestAnimationFrame(startAnimationLoop);
  if (updateCallback) {
    updateCallback(clock.getDelta() * clock.multiplier);
  }
  render();
}

//=============================================================================
// maths
//=============================================================================
// true if the vector length is within a small delta of 1
export function isVectorNormalised(vector) {
  var diff = Math.abs(1 - vector.length());
  return (diff < 0.01);
}

// pass in two Vector3s and their radii. Y axis is ignored.
export function doCirclesCollide(position1, radius1, position2, radius2) {
  if (position2 === undefined)
  {
    panic('doCirclesCollide: undefined position2');
  }
  if (radius2 === undefined)
  {
    panic('doCirclesCollide: undefined radius2');
  }
  // collision overlap must exceed a small epsilon so we don't count rounding errors
  var COLLISION_EPSILON = 0.01;
  var collisionThreshold = radius1 + radius2 - COLLISION_EPSILON; // centres must be this close together to touch
  var distance = new window.THREE.Vector2(position1.x, position1.z).distanceTo(new window.THREE.Vector2(position2.x, position2.z));
  return (distance < collisionThreshold);
}

// pass in two Vector2s, returns a Vector2
export function lineMidpoint(p1, p2) {
  var x = Math.min(p1.x, p2.x) + Math.abs( (p1.x - p2.x) / 2 );
  var y = Math.min(p1.y, p2.y) + Math.abs( (p1.y - p2.y) / 2 );
  return new window.THREE.Vector2(x, y);
}

// Pass an object with a .rotation, or a Vector3. Will mod 360.
export function yRotationToDegrees(object) {
  if (object.rotation === undefined) {
    return (object.y * TO_DEGREES) % 360;
  } else {
    return (object.rotation.y * TO_DEGREES) % 360;
  }
}

// pass in an object3D, get the .rotation as the unit vector of X and Z
export function objectRotationAsUnitVector(object) {
  // 1. sin expects radians
  // 2. have to adjust the signs to match three.js orientation
  var xComponent = -Math.sin(object.rotation.y);
  var zComponent = -Math.cos(object.rotation.y);
  var vector = new window.THREE.Vector3(xComponent, 0, zComponent);
  return vector.normalize();
}

// returns rotation in radians, suitable for object.rotation
export function randomDirection() {
  return Math.random() * 2 * Math.PI;
}

// pass in a Vector3 with X and Z values, get the rotation in radians, suitable for object.rotation.y
export function vectorToRotation(vector) {
  // we need atan2 to get all quadrants
  // atan2 rotates to the X axis (+Z for us) - so invert the values to get a rotation to -Z axis
  return Math.atan2(-vector.x, -vector.z);
}

// TODO if lookAt were fully understood we wouldn't need this?
export function rotateObjectToLookAt(object, point) {
  var vectorDelta = new window.THREE.Vector3();
  vectorDelta.subVectors(point, object.position);
  var rotation = vectorToRotation(vectorDelta);
  object.rotation.y = rotation;
}

//=============================================================================
// mouse controls
//=============================================================================
const MOUSE = {};

// capture mouse moves into MOUSE
export function mousePositionHandler(event) {
  MOUSE.x = event.clientX;
  MOUSE.y = event.clientY;
}

// Add mouse listener, init mouse to the center
export function initMouseHandler() {
  // capture mouse moves
  document.addEventListener('mousemove', mousePositionHandler, false);
  MOUSE.x = HALFWIDTH;
  MOUSE.y = HALFHEIGHT;
}

//=============================================================================
// 3D objects
//=============================================================================
// a THREE.Line coloured with a gradient from red to blue
export function Line(startPos, endPos) {
  var lineGeometry = new window.THREE.BufferGeometry();
  var positions = new Float32Array([
    startPos.x, startPos.y, startPos.z,
    endPos.x, endPos.y, endPos.z
  ]);
  var colors = new Float32Array([
    1, 0, 0, // red
    0, 0, 1  // blue
  ]);
  lineGeometry.setAttribute('position', new window.THREE.BufferAttribute(positions, 3));
  lineGeometry.setAttribute('color', new window.THREE.BufferAttribute(colors, 3));
  window.THREE.Line.call(this, lineGeometry, MATS.lineVertex); // super constructor
}
Line.prototype = Object.create(window.THREE.Line.prototype);
Line.prototype.setEnd = function(position) {
  // no op - will this animate/update correctly if we change the geometry?
};

// FIXME pointing at a normalized vector doesn't work?
// 1. Point along a normalized vector, or
// 2. Point at another arbitrary position if the pointAt arg is present
// default length is 200
export function Pointer(position, direction, length, pointAt) {
  if (length === undefined)
  {
    length = 200;
  }

  var lineGeometry = new window.THREE.BufferGeometry();
  if (pointAt === undefined)
  {
    // 1. use a normal vector
    if (!isVectorNormalised(direction))
    {
      throw('direction must be a normal, length: ' + direction.length());
    }
    var endPoint = direction.clone().multiplyScalar(length);
    endPoint.add(position);

    var positions = new Float32Array([
      position.x, position.y, position.z,
      endPoint.x, endPoint.y, endPoint.z
    ]);
    var colors = new Float32Array([
      0, 0.667, 0, // green
      1, 1, 1      // white
    ]);
    lineGeometry.setAttribute('position', new window.THREE.BufferAttribute(positions, 3));
    lineGeometry.setAttribute('color', new window.THREE.BufferAttribute(colors, 3));
    window.THREE.Line.call(this, lineGeometry, MATS.lineVertex); // super constructor
  }
  else
  {
    // 2. point at something
    // first create at the origin with our length pointing 'forward'
    var positions = new Float32Array([
      0, 0, 0,
      0, 0, length
    ]);
    var colors = new Float32Array([
      0, 0.667, 0, // green
      1, 1, 1      // white
    ]);
    lineGeometry.setAttribute('position', new window.THREE.BufferAttribute(positions, 3));
    lineGeometry.setAttribute('color', new window.THREE.BufferAttribute(colors, 3));

    window.THREE.Line.call(this, lineGeometry, MATS.lineVertex); // super constructor
    // then move and rotate
    this.position.copy(position);
    this.lookAt(direction);
  }
}
Pointer.prototype = Object.create(window.THREE.Line.prototype);

// Create a marker sphere at a location with a material
// mat is optional, default is wireframe
export function markerAt(x, y, z, mat) {
  if (!mat) {
    mat = MATS.normal;
  }
  var marker = new window.THREE.Mesh(new window.THREE.SphereGeometry(10, 16, 16), mat);
  marker.position.set(x, y, z);
  marker.castShadow = true;
  scene.add(marker);
  return marker;
}

// Display some text as a 2D quad
// text will appear to top left of point, facing the camera
export function textAt(x, y, z, text) {
  // make a canvas...
  var c = document.createElement('canvas');
  c.getContext('2d').font = '50px Arial';
  c.getContext('2d').fillText(text, 2, 50);
  // ...into a texture
  var tex = new window.THREE.Texture(c);
  tex.needsUpdate = true;
  // create material
  var mat = new window.THREE.MeshBasicMaterial({
    map : tex,
    transparent : true,
    side : window.THREE.DoubleSide
  });
  var textQuad = new window.THREE.Mesh(new window.THREE.PlaneGeometry(c.width/2, c.height/2), mat);
  textQuad.position.set(x, y, z);
  scene.add(textQuad);
  return textQuad;
}

//=============================================================================
// materials
//=============================================================================
const MATS = {};
MATS.red = new window.THREE.MeshLambertMaterial({ color : 0xDD0000 });
MATS.blue = new window.THREE.MeshLambertMaterial({ color : 0x0000DD });
MATS.green = new window.THREE.MeshLambertMaterial({ color : 0x00DD00 });
MATS.white = new window.THREE.MeshLambertMaterial({ color : 0xFFFFFF });
MATS.yellow = new window.THREE.MeshLambertMaterial({ color : 0xFFFF00 });
MATS.normal = new window.THREE.MeshNormalMaterial();
MATS.wireframe = new window.THREE.MeshBasicMaterial({color : 0xFFFFFF, wireframe: true, transparent: true});
MATS.lineVertex = new window.THREE.LineBasicMaterial( { vertexColors: window.THREE.VertexColors, linewidth: 1 } );

// constructor. Pass an array of colors (hex numbers), and the number of frames to display each.
export function FlickeringBasicMaterial(hexArray, framesForEach) {
  if ( !(hexArray instanceof Array) )
  {
    panic('hexArray not an Array');
  }
  if (typeof(hexArray[0]) !== 'number')
  {
    panic('hexArray must contain numbers');
  }
  if (hexArray.length < 1)
  {
    panic('hexArray is empty');
  }
  if (framesForEach === undefined)
  {
    panic('framesForEach undefined');
  }

  // Don't call parent constructor - instead create a proper instance
  // and copy properties to this
  const baseMaterial = new window.THREE.MeshBasicMaterial();
  Object.setPrototypeOf(this, FlickeringBasicMaterial.prototype);

  // Copy all properties from the base material to this
  Object.assign(this, baseMaterial);

  // config. Create Color objects out of the hex values
  this.colorArray = hexArray.map(function(color) { return new window.THREE.Color(color); });
  this.framesForEach = framesForEach;

  // current state
  this.frameCounter = 0;
  this.currentColor = 0;
  this.color = this.colorArray[this.currentColor];
}

FlickeringBasicMaterial.prototype = Object.create(window.THREE.MeshBasicMaterial.prototype);
FlickeringBasicMaterial.prototype.constructor = FlickeringBasicMaterial;

FlickeringBasicMaterial.prototype.tick = function() {
  this.frameCounter += 1;
  // change the color if needed
  if (this.frameCounter === this.framesForEach)
  {
    this.currentColor += 1;
    if (this.currentColor === this.colorArray.length)
    {
      this.currentColor = 0;
    }
    this.color = this.colorArray[this.currentColor];

    // reset counter
    this.frameCounter = 0;
  }
};

//=============================================================================
// colors
//=============================================================================
// From http://chriskempson.github.io/base16/
export const COLORMAP_BASE16 = [
  [0.00, '0x151515'],
  [0.07, '0x202020'],
  [0.13, '0x303030'],
  [0.20, '0x505050'],
  [0.27, '0xb0b0b0'],
  [0.33, '0xd0d0d0'],
  [0.40, '0xe0e0e0'],
  [0.47, '0xf5f5f5'],
  [0.53, '0xac4142'],
  [0.60, '0xd28445'],
  [0.67, '0xf4bf75'],
  [0.73, '0x90a959'],
  [0.80, '0x75b5aa'],
  [0.87, '0x6a9fb5'],
  [0.93, '0xaa759f'],
  [1.00, '0x8f5536']
];

// Getter functions for private variables
export function getRenderer() { return renderer; }
export function getCamera() { return camera; }
export function setCamera(newCamera) { camera = newCamera; }
export function getScene() { return scene; }
export function getClock() { return clock; }
export function getThreeDiv() { return threeDiv; }

// Export default object for backward compatibility
export default {
  threeDiv: () => threeDiv,
  X_AXIS,
  Y_AXIS,
  Z_AXIS,
  MATS,
  init3d,
  addHelpers,
  newThreeStats,
  setupRStats,
  render,
  setUpdateCallback,
  startAnimationLoop,
  isVectorNormalised,
  doCirclesCollide,
  lineMidpoint,
  yRotationToDegrees,
  objectRotationAsUnitVector,
  randomDirection,
  vectorToRotation,
  rotateObjectToLookAt,
  mousePositionHandler,
  initMouseHandler,
  Line,
  Pointer,
  markerAt,
  textAt,
  FlickeringBasicMaterial,
  COLORMAP_BASE16,
  getRenderer,
  getCamera,
  setCamera,
  getScene,
  getClock,
  getThreeDiv
};