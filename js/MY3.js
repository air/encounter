'use strict';

var MY3 = {};

//=============================================================================
// setup for server-side testing
//=============================================================================
if (typeof require === 'function') // test for nodejs environment
{
  var THREE = require('three');
}

if (typeof window === 'undefined')
{
  var window = {};
  window.innerWidth = '480';
  window.innerHeight = '640';
}
//=============================================================================
// runtime environment
//=============================================================================
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var HALFWIDTH = window.innerWidth / 2;
var HALFHEIGHT = window.innerHeight / 2;

//=============================================================================
// constants
//=============================================================================
var X_AXIS = new THREE.Vector3(1,0,0);
var Y_AXIS = new THREE.Vector3(0,1,0);
var Z_AXIS = new THREE.Vector3(0,0,1);

//=============================================================================
// global objects
//=============================================================================
// rendering objects
var renderer, camera, scene;

// timing - pass autoStart to start the clock the next time it's called
var clock = new THREE.Clock(true);
clock.multiplier = 1000; // expose this so we can manipulate it for fun times

// stats
var rstats;
var threestats;

//=============================================================================
// init functions
//=============================================================================
// optional argument: far - draw distance, defaults to 10,000
MY3.init3d = function(far)
{
  var VIEW_ANGLE = 45; // degrees not radians
  var ASPECT = WIDTH / HEIGHT;
  var NEAR = 0.1; // objects closer than this won't render
  var FAR = (typeof far === 'undefined') ? 10000 : far;

  renderer = new THREE.WebGLRenderer();
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene = new THREE.Scene();
  scene.add(camera);
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMapEnabled = true;
}

MY3.addHelpers = function()
{
  var axis = new THREE.AxisHelper(300);
  scene.add(axis);
  var camHelp = new THREE.CameraHelper(camera);
  scene.add(camHelp);
}

// Basic FPS counter from THREE
MY3.newThreeStats = function()
{
  var STATS = new Stats();
  STATS.domElement.style.position = 'absolute';
  STATS.domElement.style.top = '';
  STATS.domElement.style.bottom = '0px';
  STATS.domElement.style.opacity = '0.5';
  document.body.appendChild(STATS.domElement);
  return STATS;
}

// Use a more advanced stats counter. Requires 'renderer' to exist
MY3.setupRStats = function()
{
  // three.js plugin
  //threestats = new threeStats(renderer); // when restoring, don't forget plugins: below
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
    //plugins: [threestats]
  };
  rstats = new rStats(settings);
}

//=============================================================================
// core animation loop
//=============================================================================
MY3.render = function()
{
  rstats('frame').start();
  rstats('FPS').frame();
  
  renderer.render(scene, camera);  
  
  rstats('frame').end();
  rstats().update(); // redraw the widget
}

// You need to implement the global function update(timeDeltaMillis).
// This function calls MY3.render().
MY3.startAnimationLoop = function()
{
  requestAnimationFrame(MY3.startAnimationLoop);

  rstats('engine').start();
  update(clock.getDelta() * clock.multiplier);
  rstats('engine').end();

  MY3.render();
}

//=============================================================================
// maths
//=============================================================================
// true if the vector length is within a small delta of 1
MY3.isVectorNormalised = function(vector)
{
  var diff = Math.abs(1 - vector.length());
  return (diff < 0.01);
}

// pass in two Vector3s and their radii. Y axis is ignored.
MY3.doCirclesCollide = function(position1, radius1, position2, radius2)
{
  // collision overlap must exceed a small epsilon so we don't count rounding errors
  var COLLISION_EPSILON = 0.01;
  var collisionThreshold = radius1 + radius2 - COLLISION_EPSILON; // centres must be this close together to touch
  var distance = new THREE.Vector2(position1.x, position1.z).distanceTo(new THREE.Vector2(position2.x, position2.z));    
  return (distance < collisionThreshold);
}

// pass in two Vector2s, returns a Vector2
MY3.lineMidpoint = function(p1, p2)
{
  var  x, y, dx, dy;
  x = Math.min(p1.x, p2.x) + Math.abs( (p1.x - p2.x) / 2 );
  y = Math.min(p1.y, p2.y) + Math.abs( (p1.y - p2.y) / 2 );
  return new THREE.Vector2(x, y);
};

// Pass an object with a .rotation, or a Vector3. Will mod 360.
// Note the axes: 0 is negative along Z axis, and it turns anticlockwise from there, so:
// 90 along negative X axis
// 180 along positive Z axis
// -90 along positive X axis
MY3.yRotationToDegrees = function(object)
{
  if (typeof object.rotation === 'undefined') {
    return (object.y * UTIL.TO_DEGREES) % 360;
  } else {
    return (object.rotation.y * UTIL.TO_DEGREES) % 360;
  }
};

// pass in an object3D, get the .rotation as the unit vector of X and Z
MY3.objectRotationAsUnitVector = function(object)
{
  // 1. sin expects radians
  // 2. have to adjust the signs to match three.js orientation
  var xComponent = -Math.sin(object.rotation.y);
  var zComponent = -Math.cos(object.rotation.y);
  var vector = new THREE.Vector3(xComponent, 0, zComponent);
  return vector.normalize();
}

// returns rotation in radians, suitable for object.rotation
MY3.randomDirection = function()
{
  return Math.random() * 2 * Math.PI;
}

// pass in a Vector3 with X and Z values, get the rotation in radians, suitable for object.rotation.y
// Note the axes: 0 is negative along Z axis, and it turns anticlockwise from there, so:
// 90 along negative X axis
// 180 along positive Z axis
// -90 along positive X axis
MY3.vectorToRotation = function(vector)
{
  // we need atan2 to get all quadrants
  // atan2 rotates to the X axis (+Z for us) - so invert the values to get a rotation to -Z axis
  return Math.atan2(-vector.x, -vector.z);
}

// TODO if lookAt were fully understood we wouldn't need this?
MY3.rotateObjectToLookAt = function(object, point)
{
  var vectorDelta = new THREE.Vector3();
  vectorDelta.subVectors(point, object.position);
  var rotation = this.vectorToRotation(vectorDelta);
  object.rotation.y = rotation;
}

//=============================================================================
// mouse controls
//=============================================================================
var MOUSE = {};

// capture mouse moves into MOUSE
MY3.mousePositionHandler = function(event)
{
  MOUSE.x = event.clientX;
  MOUSE.y = event.clientY;
}

// Add mouse listener, init mouse to the center
MY3.initMouseHandler = function()
{
  // capture mouse moves
  document.addEventListener('mousemove', MY3.mousePositionHandler, false);
  MOUSE.x = HALFWIDTH;
  MOUSE.y = HALFHEIGHT;
}

//=============================================================================
// 3D objects
//=============================================================================
// a THREE.Line coloured with a gradient from red to blue
// TODO remove OO nonsense
MY3.Line = function(startPos, endPos)
{
  var lineGeometry = new THREE.Geometry();
  lineGeometry.vertices.push(startPos);
  lineGeometry.vertices.push(endPos);
  lineGeometry.colors.push(new THREE.Color( 0xff0000 ));
  lineGeometry.colors.push(new THREE.Color( 0x0000ff ));
  THREE.Line.call(this, lineGeometry, MATS.lineVertex); // super constructor
};
MY3.Line.prototype = Object.create(THREE.Line.prototype);
MY3.Line.prototype.setEnd = function(position)
{
  // no op - will this animate/update correctly if we change the geometry?
};

// FIXME pointing at a normalized vector doesn't work?
// TODO remove OO nonsense
// 1. Point along a normalized vector, or
// 2. Point at another arbitrary position if the pointAt arg is present
// default length is 200
MY3.Pointer = function(position, direction, length, pointAt)
{
  var length = (typeof length === 'undefined') ? 200 : length;
  if (typeof pointAt === 'undefined')
  {
    // 1. use a normal vector
    if (!MY3.isVectorNormalised(direction)) throw ('direction must be a normal, length: ' + direction.length());
    var endPoint = direction.clone().multiplyScalar(length);
    endPoint.add(position);

    var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(position);
    lineGeometry.vertices.push(endPoint);
    lineGeometry.colors.push(new THREE.Color( 0x00aa00 ));
    lineGeometry.colors.push(new THREE.Color( 0xffffff ));
    THREE.Line.call(this, lineGeometry, MATS.lineVertex); // super constructor
  }
  else
  {
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

// Create a marker sphere at a location with a material
// mat is optional, default is wireframe
MY3.markerAt = function(x, y, z, mat)
{
  if (!mat) {
    mat = MATS.normal;
  }
  var marker = new THREE.Mesh(new THREE.SphereGeometry(10, 16, 16), mat);
  marker.position.set(x, y, z);
  marker.castShadow = true;
  scene.add(marker);
  return marker;
}

// Display some text as a 2D quad
// text will appear to top left of point, facing the camera
MY3.textAt = function(x, y, z, text)
{
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

//=============================================================================
// materials
//=============================================================================
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

//=============================================================================
// colors
//=============================================================================
// colorMaps for THREE.Lut, example use
//   var colorTable = new THREE.Lut('rainbow', 16);
//   colorTable.addColorMap('base16', map);
//   colorTable = colorTable.changeColorMap('base16'); // Lut is pretty broken - this.mapname will be wrong

// From http://chriskempson.github.io/base16/
MY3.COLORMAP_BASE16 = [
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

//=============================================================================
// make available in nodejs
//=============================================================================
if (typeof exports !== 'undefined')
{
  module.exports = MY3;
}