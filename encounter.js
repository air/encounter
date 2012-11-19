"use strict";

// Encounter: reverse engineering facts
// time for complete rotation: 9s
// time to pass 10 obelisks: 8s

// TODOs
// move to THREE.Clock in all js files
// check use of obj.position for everything - technically this is all local positioning
// review class variables and make em private with var
// Make into classes:
//  OB - include a radius property and optimise physics function signatures
//  the grid (OB.rows)

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

// main ----------------------------------------------------------------------------
init3d(OB.MAX_X * 1.4);
scene.add(new THREE.AxisHelper(300));
initEncounterObjects();
initEncounterControls();
document.body.appendChild(renderer.domElement);
initListeners();

// late init so we can use the camera
var player = camera; // just overload the camera for now
// TODO make a class
player.lastTimeFired = 0;
player.shotsInFlight = 0;

console.info('init complete');
animate();

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
}

// can be invoked at runtime
function initFlyControls() {
  cameraControls = new THREE.FirstPersonControls(camera);
  cameraControls.movementSpeed = 2.0;
  cameraControls.lookSpeed = 0.0001;
  cameraControls.constrainVertical = true; // default false
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
    cameraControls.update(t);
    interpretKeys(t);
    //collisions();
  }
}