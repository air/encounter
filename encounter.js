"use strict";

// Encounter: reverse engineering facts
// time for complete rotation: 9s
// time to pass 10 obelisks: 8s

// TODOs

// obelisks
var OB = new Object();
OB.gridSizeX = 50;
OB.gridSizeZ = 50;
OB.spacing = 1000;
OB.height = 100;
OB.radius = 40;
OB.MAX_X = (OB.gridSizeX - 1) * OB.spacing;
OB.MAX_Z = (OB.gridSizeZ - 1) * OB.spacing;

// player
var PLAYER = new Object();
PLAYER.cameraHeight = OB.height / 2;
PLAYER.shots = new Object();
PLAYER.shots.interval = 1000; // ms
PLAYER.shots.allowed = 3;
PLAYER.shots.lastTimeFired = 0;
PLAYER.shots.inFlight = 0;

// shots
var SHOT = new Object();
SHOT.radius = 45;

// constants modelling the original game
var ENCOUNTER = new Object();
ENCOUNTER.drawDistance = 3000; // use with init3D()
ENCOUNTER.movementSpeed = 1.2;
ENCOUNTER.turnSpeed = 0.0007;
ENCOUNTER.shotSpeed = 1.8; // TODO confirm

// objects we want visible in the debugger
var cameraControls;
var keys = new EncounterKeys();
var sound = new EncounterSound();
var GROUND = new Object();

// main
init3d(OB.MAX_X);
scene.add(new THREE.AxisHelper(300));
initEncounterObjects();
initEncounterControls();
document.body.appendChild(renderer.domElement);
initListeners();
console.info('init complete');
animate();

function initEncounterObjects() {
  OB.geometry = new THREE.CylinderGeometry(OB.radius, OB.radius, OB.height, 16, 1, false); // topRadius, bottomRadius, height, segments, heightSegments
  OB.material = MATS.normal;

  SHOT.geometry = new THREE.SphereGeometry(SHOT.radius);
  SHOT.material = MATS.normal;

  // TODO consider adding all obelisks to an invisible parent object
  for (var xpos=0; xpos<(OB.gridSizeX * OB.spacing); xpos+=OB.spacing) {
    for (var zpos=0; zpos<(OB.gridSizeZ * OB.spacing); zpos+=OB.spacing) {
      var obelisk = new THREE.Mesh(OB.geometry, OB.material);
      obelisk.position.set(xpos, OB.height / 2, zpos);
      scene.add(obelisk);
    }
  }
  console.info('obelisks placed')

  // ground plane. Lots of segments will KILL your fps
  GROUND.geometry = new THREE.PlaneGeometry(OB.MAX_X, OB.MAX_Z, 16, 16);
  //GROUND.material = new THREE.MeshLambertMaterial({ color : C64.palette.green });
  GROUND.material = MATS.normal;
  GROUND.material.side = THREE.DoubleSide; // TODO remove this
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

  camera.position.set(OB.MAX_X / 2, PLAYER.cameraHeight, OB.MAX_Z / 2);
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
}

function interpretKeys(t) {
  if (keys.shooting) {
    if (PLAYER.shots.inFlight < PLAYER.shots.allowed) {
      var now = new Date().getTime();
      var timeSinceLastShot = now - PLAYER.shots.lastTimeFired;
      if (timeSinceLastShot > PLAYER.shots.interval) {
        shoot(camera);
        PLAYER.shots.inFlight += 1;
        PLAYER.shots.lastTimeFired = now;
      }
      
    }
  }
}

function shoot(firingObject) {
  console.info('BAM!');
  sound.playerShoot();
}

function updateGameState(t) {
  // no op
}

function update(t) {
  cameraControls.update(t);
  interpretKeys(t);
  updateGameState(t);
}