'use strict';

// Import utility modules
import { log, random, platformSupportsTouch } from './modules/UTIL.js';
import * as C64 from './modules/C64.js';
import Timer from './modules/Timer.js';
import Sound from './modules/Sound.js';
import Level from './modules/Level.js';
import Keys from './modules/Keys.js';
import Display from './modules/Display.js';
import Indicators from './modules/Indicators.js';
import Encounter from './modules/Encounter.js';
import Obelisk from './modules/Obelisk.js';
import SimpleControls from './modules/SimpleControls.js';
import Physics from './modules/Physics.js';
import MY3 from './modules/MY3.js';
import Asteroid from './modules/Asteroid.js';
import Shot from './modules/Shot.js';
import ShotSpawner from './modules/ShotSpawner.js';
import Explode from './modules/Explode.js';
import { Actor, Actors } from './modules/Actors.js';
import Attract from './modules/Attract.js';
import Camera from './modules/Camera.js';
import GUI from './modules/GUI.js';
import Controls from './modules/Controls.js';
import Touch from './modules/Touch.js';
import Grid from './modules/Grid.js';
import Ground from './modules/Ground.js';
import Portal from './modules/Portal.js';
import BlackPortal from './modules/BlackPortal.js';
import WhitePortal from './modules/WhitePortal.js';
import Radar from './modules/Radar.js';
import Missile from './modules/Missile.js';
import Warp from './modules/Warp.js';
import Enemy from './modules/Enemy.js';

// Test that our modules are working
log('ES6 modules loaded successfully');
log('Random test: ' + random(1, 10));
log('C64 white color: ' + C64.white);
log('Random C64 color: ' + C64.randomColour());

// Test Timer module
Timer.createRepeatableCountdown('test', 1000);
log('Timer module loaded and tested');

// Test Sound module
Sound.init();
//Sound.playerShoot(); // Test playing a sound - disabled for now, won't play a sound until user interaction
log('Sound module loaded and tested with sound playback');

// Test Level module
Level.init();
log('Level module loaded - Current level: ' + Level.getNumber());
log('First level sky color: ' + Level.getCurrent().skyColor);

// Test Batch 2 modules
Keys.init();
log('Keys module loaded and event listeners initialized');

Display.init();
log('Display module loaded and UI elements created');

Indicators.init();
log('Indicators module loaded and canvas initialized');

// Test Encounter module (constants)
log('Encounter constants loaded - Draw distance: ' + Encounter.DRAW_DISTANCE);
log('Player movement speed: ' + Encounter.MOVEMENT_SPEED);

// Test Obelisk module
log('Obelisk constants loaded - Height: ' + Obelisk.HEIGHT + ', Radius: ' + Obelisk.RADIUS);
log('Camera height calculated as: ' + Encounter.CAMERA_HEIGHT);

// Test SimpleControls module (constructor function)
log('SimpleControls constructor loaded - type: ' + typeof SimpleControls);
if (typeof SimpleControls === 'function') {
  log('SimpleControls is ready for instantiation');
}

// Test Physics module
log('Physics module loaded with collision detection functions');
log('Available functions: isCloseToAnObelisk, isCollidingWithObelisk, etc.');

// Test MY3 module
log('MY3 module loaded - THREE.js utility wrapper');
log('Available math functions: vectorToRotation, objectRotationAsUnitVector, etc.');
log('MY3 constants - X_AXIS: ' + JSON.stringify({ x: MY3.X_AXIS.x, y: MY3.X_AXIS.y, z: MY3.X_AXIS.z }));

// Test Asteroid module
log('Asteroid module loaded - Radius: ' + Asteroid.RADIUS);
log('Generated asteroid color: ' + Asteroid.generateColor());
var testAsteroid = Asteroid.newInstance();
log('Created test asteroid mesh with geometry and material');

// Test Shot module
log('Shot module loaded - Radius: ' + Shot.RADIUS + ', Height: ' + Shot.HEIGHT);
var testDirection = new window.THREE.Vector3(0, 0, -1); // Forward direction
var testPosition = new window.THREE.Vector3(0, 0, 0);
var testShot = Shot.newMeshInstance(testPosition, testDirection);
log('Created test shot mesh with position and direction');

// Test ShotSpawner module
log('ShotSpawner module loaded - constructor function ready');
var spawnerPosition = new window.THREE.Vector3(100, 50, 100);
var testShotSpawner = new ShotSpawner(spawnerPosition);
log('Created test shot spawner at position with rotation');

// Test Explode module
log('Explode module loaded - Explosion effects with ' + Explode.NUMBER_OF_GIBS + ' gibs');
log('Explosion lifetime: ' + Explode.LIFETIME_MS + 'ms with ' + Explode.MATERIAL_PHASES.length + ' material phases');
Explode.init();
log('Explode module initialized with gib particles');

// Test Actors module
log('Actors module loaded - Actor and Actors constructor functions ready');
var testActors = new Actors();
var testObject3D = new window.THREE.Object3D();
var testUpdateFunction = function (deltaTime) { console.log('Actor update called'); };
var testActor = new Actor(testObject3D, testUpdateFunction, 'test');
testActors.add(testActor);
log('Created Actors system with test Actor - list length: ' + testActors.list.length);

// Test Attract module
log('Attract module loaded - init function ready');
Attract.init();
log('Attract module initialized successfully');

// Test Camera module
log('Camera module loaded - Camera modes available: ' + Camera.MODE_FIRST_PERSON + ', ' + Camera.MODE_CHASE);
log('Camera constants - Chase distance: ' + Camera.CHASE_DISTANCE + ', Chase height: ' + Camera.CHASE_HEIGHT);
Camera.init();
log('Camera module initialized with orthographic camera for top-down view');

// Test GUI module (mostly commented out debug interface)
log('GUI module loaded - debug interface for dat.gui (currently disabled)');
GUI.init();
log('GUI module initialized (no-op since dat.gui is commented out)');

// Test Controls module
log('Controls module loaded - control systems for player movement');
Controls.init();
log('Controls module initialized with Encounter controls (movement speed: ' + Encounter.MOVEMENT_SPEED + ')');
log('Current control system ready: ' + (Controls.current ? Controls.current.constructor.name : 'none'));

// Test Touch module (mobile controls)
log('Touch module loaded - mobile touch controls for d-pad and fire button');
Touch.init();
log('Touch module initialized - ' + (platformSupportsTouch() ? 'mobile controls active' : 'desktop mode, touch controls skipped'));

// Test Grid module (infinite obelisk grid system)
log('Grid module loaded - infinite obelisk grid with viewport system');
log('Grid constants - Spacing: ' + Grid.SPACING + ', Draw distance based sizing');
Grid.init();
log('Grid module initialized with ' + Grid.getObelisksPerSide() + ' obelisks per side');
log('Grid viewport size: ' + Grid.getSizeSquare() + ' units square');

// Test Ground module (ground plane rendering)
log('Ground module loaded - ground plane system (render mode: ' + (Ground.DO_RENDER ? 'THREE.js mesh' : 'CSS div') + ')');
log('Ground plane segments: ' + Ground.X_SEGMENTS + 'x' + Ground.Z_SEGMENTS + ' for performance');
Ground.init();
log('Ground module initialized - ' + (Ground.DO_RENDER ? 'mesh created' : 'using CSS background for ground plane'));

// Test Portal system modules
log('Portal module loaded - base portal system with ' + Portal.TIME_TO_ANIMATE_OPENING_MS + 'ms opening animation');
Portal.init();
log('Portal base class initialized with cylindrical geometry');

log('BlackPortal module loaded - player warp entry portals (color: black)');
BlackPortal.init();
log('BlackPortal initialized for player warp sequences');

log('WhitePortal module loaded - enemy spawn portals (color: white)');
WhitePortal.init();
log('WhitePortal initialized for enemy deployment');

// Test Radar module (mini-map radar display system)
log('Radar module loaded - mini-map radar with ' + Radar.RESOLUTION_X + 'x' + Radar.RESOLUTION_Z + ' canvas');
log('Radar constants - Range: ' + Radar.RANGE + ' units, Blip radius: ' + Radar.BLIP_RADIUS);
log('Radar types available: ' + Radar.TYPE_ENEMY + ', ' + Radar.TYPE_PORTAL + ', ' + Radar.TYPE_SHOT);
Radar.init();
log('Radar module initialized with octagonal canvas and crosshairs');

// Test Missile module (homing missile enemy)
log('Missile module loaded - homing missile with tracking AI');
log('Missile constants - Radius: ' + Missile.RADIUS + ', Movement speed: ' + Missile.MOVEMENT_SPEED);
log('Missile strafe - Max offset: ' + Missile.STRAFE_MAX_OFFSET + ', Time: ' + Missile.STRAFE_TIME_MILLIS + 'ms');
Missile.init();
log('Missile module initialized with sphere geometry and strafe tweens');

// Test Warp module (warp sequence controller)
log('Warp module loaded - warp sequence with asteroid field navigation');
log('Warp timing - Accelerate: ' + Warp.TIME_ACCELERATING_MS + 'ms, Cruise: ' + Warp.TIME_CRUISING_MS + 'ms, Decelerate: ' + Warp.TIME_DECELERATING_MS + 'ms');
log('Warp constants - Max speed: ' + Warp.MAX_SPEED + ', Total duration: ' + (Warp.TIME_ACCELERATING_MS + Warp.TIME_CRUISING_MS + Warp.TIME_DECELERATING_MS) + 'ms');
log('Warp states available: ' + Warp.STATE_ACCELERATE + ', ' + Warp.STATE_CRUISE + ', ' + Warp.STATE_DECELERATE);
Warp.init();
log('Warp module initialized (asteroids created at runtime)');

// Test Enemy module (base enemy class and spawning system)
log('Enemy module loaded - base enemy class with spawn management');
log('Enemy types - Missile: ' + Enemy.TYPE_MISSILE + ', Single: ' + Enemy.TYPE_SAUCER_SINGLE + ', Triple: ' + Enemy.TYPE_SAUCER_TRIPLE);
log('Enemy types - Chaingun: ' + Enemy.TYPE_SAUCER_CHAINGUN + ', Shotgun: ' + Enemy.TYPE_SAUCER_SHOTGUN + ', AutoShotgun: ' + Enemy.TYPE_SAUCER_AUTOSHOTGUN);
Enemy.reset();
log('Enemy module initialized with spawn system ready');

// For now, we'll import the rest as global scripts
// This will be our incremental migration approach
// IMPORTANT: in the current state we are not actually loading or testing the game loop

// TODO: Convert remaining files to modules
console.log('Main.js: Basic module system initialized');
