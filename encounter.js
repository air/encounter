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
// replace direct use of rotation.y with rotateOnAxis()
// Make into classes:
//  OB - include a radius property and optimise physics function signatures
// see if we can improve timestep, e.g. http://gafferongames.com/game-physics/fix-your-timestep/
// ease down the clock multiplier for a very cool slow-mo effect. This will break clock-elapsed timers.

// constants modelling the original game
var ENCOUNTER = new Object();
ENCOUNTER.DRAW_DISTANCE = 3000; // use with init3D() for the real C64 draw distance
ENCOUNTER.CAMERA_HEIGHT = Obelisk.HEIGHT / 2;
ENCOUNTER.MOVEMENT_SPEED = 1.2;
ENCOUNTER.TURN_SPEED = 0.0007;
ENCOUNTER.SHOT_SPEED = 3.0;
ENCOUNTER.SHOT_INTERVAL_MS = 400;
ENCOUNTER.MAX_PLAYERS_SHOTS_ALLOWED = 15; // original has illusion of no shot limit or range limit, but max 3 on screen

// objects we want visible in the debugger
var isPaused = false;
var cameraControls;
var keys = new EncounterKeys();
var sound = new EncounterSound();
var physics = new EncounterPhysics();
physics.debug = false;
var actors = new Array();
var GROUND = new Object();
var gui = new dat.GUI();
var global = Function('return this')(); // nice hacky ref to global object for dat.gui

// main ----------------------------------------------------------------------------
init3d(Grid.MAX_X * 1.4); // draw distance to see mostly the whole grid, whatever size that is
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
  // ground plane. Lots of segments will KILL your fps
  GROUND.geometry = new THREE.PlaneGeometry(Grid.MAX_X, Grid.MAX_Z, 16, 16);
  //GROUND.material = new THREE.MeshLambertMaterial({ color : C64.palette.green });
  GROUND.material = MATS.normal;
  GROUND.object = new THREE.Mesh(GROUND.geometry, GROUND.material);
  // plane inits as a wall on X axis facing the positive Z space, turn away to make a floor
  GROUND.object.rotation.x = -90 * TO_RADIANS;
  // plane is anchored at its centre
  GROUND.object.position.x = Grid.MAX_X / 2;
  GROUND.object.position.z = Grid.MAX_Z / 2;
  // zero Y is ground
  GROUND.object.position.y = 0;
  GROUND.object.receiveShadow = true;
  scene.add(GROUND.object);
  console.info('ground plane placed');

  Grid.init();

  camera.position.set(Grid.MAX_X / 2, ENCOUNTER.CAMERA_HEIGHT, Grid.MAX_Z / 2);

  // shot testing
  var spawner = new ShotSpawner(camera.position);
  spawner.setRotationDegreesPerSecond(-45);
  actors.push(spawner);
  scene.add(spawner);
  var spawner2 = new ShotSpawner(camera.position);
  spawner2.setRotationDegreesPerSecond(45);
  actors.push(spawner2);
  scene.add(spawner2);
  camera.position.set(Grid.MAX_X / 2, 4000, Grid.MAX_Z / 2);
  camera.lookAt(new THREE.Vector3(Grid.MAX_X / 2, ENCOUNTER.CAMERA_HEIGHT, Grid.MAX_Z / 2)); // not working
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
  cameraControls.movementSpeed = ENCOUNTER.MOVEMENT_SPEED;
  cameraControls.turnSpeed = ENCOUNTER.TURN_SPEED;
  camera.position.y = ENCOUNTER.CAMERA_HEIGHT;
  camera.rotation.x = 0;
  camera.rotation.z = 0;
}

function interpretKeys(t) {
  if (keys.shooting) {
    if (player.shotsInFlight < ENCOUNTER.MAX_PLAYERS_SHOTS_ALLOWED) {
      // FIXME use the clock
      var now = new Date().getTime();
      var timeSinceLastShot = now - player.lastTimeFired;
      if (timeSinceLastShot > ENCOUNTER.SHOT_INTERVAL_MS) {
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