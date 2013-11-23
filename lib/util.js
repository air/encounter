"use strict";

if (UTIL == null || typeof(UTIL) != "object") { var UTIL = new Object(); } else { throw('can\'t reserve namespace UTIL'); }

//=============================================================================
// general js
//=============================================================================
var TO_RADIANS = Math.PI / 180;
var TO_DEGREES = 180 / Math.PI;

function random(max) {
  return random(0, max);
}

function random(min, max) {
  if (max > min) {
    var range = max - min;
    return Math.floor(Math.random() * (range + 1)) - max;
  } else {
    console.log('max should be more than min');
    return 0;
  }
}

// add mouse listener
// init mouse to center
// req: onDocumentMouseMove
function initListeners() {
  // capture mouse moves
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  MOUSE.x = HALFWIDTH;
  MOUSE.y = HALFHEIGHT;
}

// capture mouse moves
function onDocumentMouseMove(event) {
  MOUSE.x = event.clientX;
  MOUSE.y = event.clientY;
}

//=============================================================================
// three.js
//=============================================================================

// TODO: move all this stuff under this namespace
if (MY3 == null || typeof(MY3) != "object") { var MY3 = new Object(); } else { throw('can\'t reserve namespace MY3'); }

// init timing - pass autoStart to start the clock the next time it's called
var clock = new THREE.Clock(true);
clock.multiplier = 1000; // expose this so we can manipulate it for fun times

// rendering objects
var renderer, camera, scene;
// x and y
var MOUSE = {};
// dimensions
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var HALFWIDTH = window.innerWidth / 2;
var HALFHEIGHT = window.innerHeight / 2;
// material constants
var MATS = {};
MATS.red = new THREE.MeshLambertMaterial({ color : 0xDD0000 });
MATS.blue = new THREE.MeshLambertMaterial({ color : 0x0000DD });
MATS.green = new THREE.MeshLambertMaterial({ color : 0x00DD00 });
MATS.white = new THREE.MeshLambertMaterial({ color : 0xFFFFFF });
MATS.yellow = new THREE.MeshLambertMaterial({ color : 0xFFFF00 });
MATS.normal = new THREE.MeshNormalMaterial();
MATS.wireframe = new THREE.MeshBasicMaterial({color : 0xFFFFFF, wireframe: true, transparent: true});
// TODO linewidth is broken https://github.com/mrdoob/three.js/issues/269
MATS.lineVertex = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors, linewidth: 1 } );

// fps counter
var STATS;

// TODO add custom counters to STATS

// optional args:
// far - draw distance, defaults to 10,000
function init3d(far) {
  var VIEW_ANGLE = 45; // degrees not radians
  var ASPECT = WIDTH / HEIGHT;
  var NEAR = 0.1; // objects closer than this won't render
  var FAR = (typeof far === "undefined") ? 10000 : far;

  renderer = new THREE.WebGLRenderer();
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene = new THREE.Scene();
  scene.add(camera);
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMapEnabled = true;

  STATS = new Stats();
  STATS.domElement.style.position = 'absolute';
  STATS.domElement.style.top = '0px';
  document.body.appendChild(STATS.domElement);
}

function addHelpers(){
  var axis = new THREE.AxisHelper(300);
  scene.add(axis);
  var camHelp = new THREE.CameraHelper(camera);
  scene.add(camHelp);
}

// extended THREE.Line
MY3.Line = function(startPos, endPos) {
  var lineGeometry = new THREE.Geometry();
  lineGeometry.vertices.push(startPos);
  lineGeometry.vertices.push(endPos);
  lineGeometry.colors.push(new THREE.Color( 0xff0000 ));
  lineGeometry.colors.push(new THREE.Color( 0x0000ff ));
  THREE.Line.call(this, lineGeometry, MATS.lineVertex); // super constructor
};
MY3.Line.prototype = Object.create(THREE.Line.prototype);
MY3.Line.prototype.setEnd = function(position) {
  // no op - will this animate/update correctly if we change the geometry?
};

// FIXME pointing at a normalized vector doesn't work?
// 1. Point along a normalized vector, or
// 2. Point at another arbitrary position if the pointAt arg is present
// default length is 200
MY3.Pointer = function(position, direction, length, pointAt) {
  var length = (typeof length === "undefined") ? 200 : length;
  if (typeof pointAt === "undefined") {
    // 1. use a normal vector
    if (!MY3.isNormalised(direction)) throw ('direction must be a normal, length: ' + direction.length());
    var endPoint = direction.clone().multiplyScalar(length);
    endPoint.add(position);

    var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(position);
    lineGeometry.vertices.push(endPoint);
    lineGeometry.colors.push(new THREE.Color( 0x00aa00 ));
    lineGeometry.colors.push(new THREE.Color( 0xffffff ));
    THREE.Line.call(this, lineGeometry, MATS.lineVertex); // super constructor
  } else {
    // 2. point at something
    // first create at the origin with our length pointing 'forward'
    var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    lineGeometry.vertices.push(new THREE.Vector3(0, 0, length));
    lineGeometry.colors.push(new THREE.Color( 0x00aa00 ));
    lineGeometry.colors.push(new THREE.Color( 0xffffff ));

    THREE.Line.call(this, lineGeometry, MATS.lineVertex); // super constructor
    // then move and rotate
    this.position.copy(position);
    this.lookAt(direction);
  }
}
MY3.Pointer.prototype = Object.create(THREE.Line.prototype);

// true if the vector length is within a small delta of 1
MY3.isNormalised = function(vector) {
  var diff = Math.abs(1 - vector.length());
  return (diff < 0.01);
}

// mat is optional, default is wireframe
// req: scene
function markerAt(x, y, z, mat) {
  if (!mat) {
    mat = MATS.normal;
  }
  var marker = new THREE.Mesh(new THREE.SphereGeometry(10, 16, 16), mat);
  marker.position.set(x, y, z);
  marker.castShadow = true;
  scene.add(marker);
  return marker;
}

// text will appear to top left of point, facing the camera
function textAt(x, y, z, text) {
  // make a canvas...
  var c = document.createElement('canvas');
  c.getContext('2d').font = '50px Arial';
  c.getContext('2d').fillText(text, 2, 50);
  // ...into a texture
  var tex = new THREE.Texture(c);
  tex.needsUpdate = true;
  // create material
  var mat = new THREE.MeshBasicMaterial({
    map : tex,
    transparent : true,
    side : THREE.DoubleSide
  });
  var textQuad = new THREE.Mesh(new THREE.PlaneGeometry(c.width/2, c.height/2), mat);
  textQuad.position.set(x, y, z);
  scene.add(textQuad);
  return textQuad;
}

function render() {
  renderer.render(scene, camera);
}

// req: update(t)
function animate() {
  requestAnimationFrame(animate);

  update(clock.getDelta() * clock.multiplier);

  render();
  STATS.update();
}
