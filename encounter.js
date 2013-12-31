"use strict";

// Encounter: reverse engineering facts
// time for complete rotation: 9s
// time to pass 10 obelisks: 8s

// = Principles
// The file is the unit of organization, not the class
// = TODO
// third camera mode where we use tank controls but the camera is in chase mode
// can event.preventDefault() help with the dropdown menu stealing focus?
// Use a THREE.ArrowHelper for the Pointer class together with a child object
// rationalise the notion of actors (affected by pause) and pause-immune actors
// fade sound based on proximity
// see if we can improve timestep, e.g. http://gafferongames.com/game-physics/fix-your-timestep/
// replace direct use of rotation.n.set with rotateOnAxis()
// top down radar which is an actual second OrthographicCamera? Good for debug also
// = FIXME
// shot pointers are incorrect in fly mode. Seem ok in normal mode
// Y rotation breaks when the camera flips from Simple to FirstPerson.
// = Effects
// ease down the clock multiplier for a very cool slow-mo effect. This will break clock-elapsed timers.
// very slow rotate/pan is cool for a 'static' but live menu screen

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
var controls; // controls are currently responsible for changing the Player position/rotation
var keys = new Keys();
var sound = new Sound();
var physics = new Physics();
physics.debug = false;
// actors are objects that stop when we go into pause mode.
var actors = new Array();
var GROUND = new Object();
var gui = new dat.GUI();
var global = Function('return this')(); // nice hacky ref to global object for dat.gui

// main -----------------------------------------------------------------------
init3d(Grid.MAX_X * 1.4); // draw distance to see mostly the whole grid, whatever size that is
initEncounterObjects();
initEncounterControls();
document.body.appendChild(renderer.domElement);
initListeners();
initGui();
console.info('init complete');
animate();
// END main -------------------------------------------------------------------

function initGui()
{
  var guiControls = gui.addFolder('Controls');
  guiControls.add(global, 'isPaused').name('paused (p)').listen();
  guiControls.add(clock, 'multiplier', 0, 2000).step(50).name('time multiplier');
  guiControls.add(keys, 'switchControls').name('toggle controls (c)');
  var guiPlayer = gui.addFolder('Player');
  //guiPlayer.open();
  guiPlayer.add(Player.position, 'x').listen().name('x');
  guiPlayer.add(Player.position, 'y').listen().name('y');
  guiPlayer.add(Player.position, 'z').listen().name('z');
  // The step values here depend on a dat.gui patch from https://code.google.com/p/dat-gui/issues/detail?id=31
  guiPlayer.add(Player.rotation, 'x').step(0.01).listen().name('rotated x');
  guiPlayer.add(Player.rotation, 'y').step(0.01).listen().name('rotated y');
  guiPlayer.add(Player.rotation, 'z').step(0.01).listen().name('rotated z');
  var guiCamera = gui.addFolder('Camera');
  guiCamera.open();
  guiCamera.add(Camera, 'mode', [Camera.MODE_FIRST_PERSON, Camera.MODE_CHASE, Camera.MODE_ORBIT, Camera.MODE_TOP_DOWN]).listen();
  //guiCamera.add(Camera, 'CHASE_HEIGHT', 0, 300).step(10);
  //guiCamera.add(Camera, 'CHASE_DISTANCE', 0, 400).step(10);
  //guiCamera.add(Camera, 'CHASE_ANGLE_DOWN', -0.5, 0.5).step(0.01);
}

function initEncounterObjects()
{
  // move the default Stats overlay
  STATS.domElement.style.top = '';
  STATS.domElement.style.bottom = '0px';
  STATS.domElement.style.opacity = '0.5';

  scene.add(new THREE.AxisHelper(800));

  Ground.init();
  Grid.init();
  Player.init();
  Enemy.init();
  Camera.init();
  Overlay.init();
  Levels.init();

  // shot testing
  //var spawner = new ShotSpawner(Player.position);
  //spawner.position.x += 800;
  //spawner.position.z -= 3600;
  //spawner.setRotationDegreesPerSecond(-45);
  //actors.push(spawner);
  //scene.add(spawner);
}

// can be invoked at runtime
function initFlyControls()
{
  controls = new THREE.FirstPersonControls(Player);
  controls.movementSpeed = 2.0;
  controls.lookSpeed = 0.0001;
  controls.constrainVertical = false; // default false
  controls.verticalMin = 45 * TO_RADIANS;
  controls.verticalMax = 135 * TO_RADIANS;
}

function initEncounterControls()
{
  controls = new SimpleControls(Player);
  controls.movementSpeed = ENCOUNTER.MOVEMENT_SPEED;
  controls.turnSpeed = ENCOUNTER.TURN_SPEED;
  Player.position.y = ENCOUNTER.CAMERA_HEIGHT;
  Player.rotation.x = 0;
  Player.rotation.z = 0;
}

function interpretKeys(timeDeltaMillis)
{
  if (keys.shooting)
  {
    Player.shoot();
  }
}

// invoked as a callback
function actorIsDead(actor)
{
  if (typeof actor === "undefined") throw('actor undefined'); // args must be an array

  var index = actors.indexOf(actor);
  if (index !== -1) {
    actors.splice(index, 1);
  }

  Player.shotsInFlight -= 1; // FIXME not general case
  scene.remove(actor);
}

// ask all actors to update their state based on the last time delta
function updateGameState(timeDeltaMillis)
{
  for (var i = 0; i < actors.length; i++) {
    actors[i].update(timeDeltaMillis);
  };
}

function update(timeDeltaMillis)
{
  // update player if we're alive, even in pause mode (for the moment)
  if (Player.isAlive)
  {
    controls.update(timeDeltaMillis);
    Player.update(timeDeltaMillis);
  }

  // camera can move after death
  Camera.update(timeDeltaMillis);

  // update non-Player game actors
  if (!isPaused && Player.isAlive)
  {
    updateGameState(timeDeltaMillis);
    interpretKeys(timeDeltaMillis);
  }
}
