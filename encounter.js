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
var keys = new Keys();
var sound = new Sound();
var actors = new Array();

var physics = new Physics();
physics.debug = false;

init3d(Grid.MAX_X * 1.4); // draw distance to see mostly the whole grid, whatever size that is
Overlay.init();
State.init();

document.body.appendChild(renderer.domElement);

initListeners();
animate();
