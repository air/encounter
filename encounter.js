"use strict";

// Encounter: reverse engineering facts
// time for complete rotation: 9s
// time to pass 10 obelisks: 8s

// TODOs
// make player a class, not the camera
// Detach the camera from the player, be able to fly free or attach to other entities
// something breaks when the camera flips from Simple to FirstPerson? Can't keep shots on the ground.
// check use of obj.position for everything - technically this is all local positioning
// review class variables and make em private with var
// fade sound based on proximity
// Make into classes:
//  OB - include a radius property and optimise physics function signatures
//  the grid (OB.rows)
// see if we can improve timestep, e.g. http://gafferongames.com/game-physics/fix-your-timestep/

// obelisk constants
var OB = new Object();
OB.gridSizeX = 50;
OB.gridSizeZ = 50;
OB.spacing = 1000;
OB.height = 100;
OB.radius = 40;
OB.MAX_X = (OB.gridSizeX - 1) * OB.spacing;
OB.MAX_Z = (OB.gridSizeZ - 1) * OB.spacing;
OB.rows = []; // each row is an X line of OB.gridSizeX obelisks

// shot constants
var SHOT = new Object();
SHOT.radius = 40;
SHOT.offset = 120; // created this far in front of you
SHOT.canTravel = 16000; // TODO confirm

// constants modelling the original game
var ENCOUNTER = new Object();
ENCOUNTER.drawDistance = 3000; // use with init3D()
ENCOUNTER.cameraHeight = OB.height / 2;
ENCOUNTER.movementSpeed = 1.2;
ENCOUNTER.turnSpeed = 0.0007;
ENCOUNTER.shotSpeed = 3.0;
ENCOUNTER.shotInterval = 400; // ms
ENCOUNTER.shotsAllowed = 15; // original has illusion of no shot limit or range limit, but max 3 on screen

// objects we want visible in the debugger
var isPaused = false;
var cameraControls;
var keys = new EncounterKeys();
var sound = new EncounterSound();
var physics = new EncounterPhysics();
var actors = new Array();
var GROUND = new Object();
var gui = new dat.GUI();
var global = Function('return this')(); // nice hacky ref to global object for dat.gui
// FIXME testing only
var spawner;

// main ----------------------------------------------------------------------------
init3d(OB.MAX_X * 1.4); // draw distance to see mostly the whole grid, whatever size that is
scene.add(new THREE.AxisHelper(800));
initEncounterObjects();
//initEncounterControls();
initFlyControls();
document.body.appendChild(renderer.domElement);
initListeners();
initGui();

// late init so we can use the camera
var player = camera; // just overload the camera for now
// TODO make a class
player.lastTimeFired = 0;
player.shotsInFlight = 0;

console.info('init complete');
animate();

function initGui() {
  gui.add(global, 'isPaused').name('paused (p)').listen();
  gui.add(clock, 'multiplier', 0, 2000).step(50).name('time multiplier');
  gui.add(keys, 'switchControls').name('toggle controls (c)');
  gui.add(camera.position, 'x').listen().name('player x');
  gui.add(camera.position, 'y').listen().name('player y');
  gui.add(camera.position, 'z').listen().name('player z');
}

function initEncounterObjects() {
  OB.geometry = new THREE.CylinderGeometry(OB.radius, OB.radius, OB.height, 16, 1, false); // topRadius, bottomRadius, height, segments, heightSegments
  OB.material = MATS.normal;
  //OB.material = MATS.wireframe.clone();
  //OB.material.color = 0x000000;

  SHOT.geometry = new THREE.SphereGeometry(SHOT.radius, 16, 16);
  SHOT.material = MATS.normal;
  //SHOT.material = MATS.wireframe;

  // TODO consider adding all obelisks to an invisible parent object
  for (var rowIndex=0; rowIndex<OB.gridSizeZ; rowIndex++) {
    var row = [];
    for (var colIndex=0; colIndex<OB.gridSizeX; colIndex++) {
      var xpos = colIndex * OB.spacing;
      var zpos = rowIndex * OB.spacing;
      var obelisk = new THREE.Mesh(OB.geometry, OB.material);
      obelisk.position.set(xpos, OB.height / 2, zpos);
      row.push(obelisk);
      scene.add(obelisk);
    }
    OB.rows[rowIndex] = row;
  }
  console.info('obelisks placed')

  // ground plane. Lots of segments will KILL your fps
  GROUND.geometry = new THREE.PlaneGeometry(OB.MAX_X, OB.MAX_Z, 16, 16);
  //GROUND.material = new THREE.MeshLambertMaterial({ color : C64.palette.green });
  GROUND.material = MATS.normal;
  GROUND.object = new THREE.Mesh(GROUND.geometry, GROUND.material);
  // plane inits as a wall on X axis facing the positive Z space, turn away to make a floor
  GROUND.object.rotation.x = -90 * TO_RADIANS;
  // plane is anchored at its centre
  GROUND.object.position.x = OB.MAX_X / 2;
  GROUND.object.position.z = OB.MAX_Z / 2;
  // zero Y is ground
  GROUND.object.position.y = 0;
  GROUND.object.receiveShadow = true;
  scene.add(GROUND.object);
  console.info('ground plane placed');

  camera.position.set(OB.MAX_X / 2, ENCOUNTER.cameraHeight, OB.MAX_Z / 2);

  spawner = new ShotSpawner(camera.position);
  actors.push(spawner);
  scene.add(spawner);
  camera.position.set(OB.MAX_X / 2, 4000, OB.MAX_Z / 2);
  camera.lookAt(new THREE.Vector3(OB.MAX_X / 2, ENCOUNTER.cameraHeight, OB.MAX_Z / 2));
}

// can be invoked at runtime
function initFlyControls() {
  cameraControls = new THREE.FirstPersonControls(camera);
  cameraControls.movementSpeed = 2.0;
  cameraControls.lookSpeed = 0.0001;
  cameraControls.constrainVertical = false; // default false
  cameraControls.verticalMin = 45 * TO_RADIANS;
  cameraControls.verticalMax = 135 * TO_RADIANS;
}

function initEncounterControls() {
  cameraControls = new SimpleControls(camera);
  cameraControls.movementSpeed = ENCOUNTER.movementSpeed;
  cameraControls.turnSpeed = ENCOUNTER.turnSpeed;
  camera.position.y = ENCOUNTER.cameraHeight;
  camera.rotation.x = 0;
  camera.rotation.z = 0;
}

function interpretKeys(t) {
  if (keys.shooting) {
    if (player.shotsInFlight < ENCOUNTER.shotsAllowed) {
      // FIXME use the clock
      var now = new Date().getTime();
      var timeSinceLastShot = now - player.lastTimeFired;
      if (timeSinceLastShot > ENCOUNTER.shotInterval) {
        shoot(player, now);
      }
    }
  }
}

// invoked as a callback
function actorIsDead(actor) {
  if (typeof actor === "undefined") throw('actor undefined'); // args must be an array

  var index = actors.indexOf(actor);
  if (index !== -1) {
    actors.splice(index, 1);
  }

  player.shotsInFlight -= 1; // FIXME not general case
  scene.remove(actor);
}

// FIXME last time fired is player specific, we want to generically emit a shot
function shoot(firingObject, time) {
  sound.playerShoot();
  var shot = new Shot(firingObject);
  shot.callbackWhenDead(actorIsDead);
  firingObject.shotsInFlight += 1;
  firingObject.lastTimeFired = time;
  actors.push(shot);
  scene.add(shot);
}


function updateGameState(t) {
  for (var i = 0; i < actors.length; i++) {
    actors[i].update(t);
  };
}

function update(t) {
  if (!isPaused) {
    updateGameState(t);
  }
  cameraControls.update(t);
  interpretKeys(t);
}