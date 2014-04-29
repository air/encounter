"use strict";

// # TODO
// fix 'edge of the world'
// add original super-cool exit from warp effect
// missile enemy
// further original UFO types
// sound effects: player move, warp, enemy windup, enemy ticking
// improve mobile FPS. e.g. merge geometry; shorter draw distance; fog
// better enemy model. Try more polys against FPS.
// work on Timer.js to use everywhere rather than 'startedAt' checks
// Use a THREE.ArrowHelper for the Pointer class together with a child object
// rationalise the notion of State.actors (affected by pause) and pause-immune State.actors
// fade sound based on proximity
// see if we can improve timestep, e.g. http://gafferongames.com/game-physics/fix-your-timestep/
// replace direct use of rotation.n.set with rotateOnAxis()
// Try http://www.createjs.com/#!/SoundJS
// refactor util.js into UTIL.js and MY3.js
// refactor Physics.js 3D stuff into MY3.js
// # FIXME
// shots in play show up in warp
// shot pointers are incorrect in fly mode. Seem ok in normal mode
// Y rotation breaks when the camera flips from Simple to FirstPerson.

// constants modelling the original game.
// time for complete rotation: 9s
// time to pass 10 obelisks: 8s
var Encounter = {};
Encounter.DRAW_DISTANCE = 3000; // use with init3D() for the real C64 draw distance
Encounter.CAMERA_HEIGHT = Obelisk.HEIGHT / 2;
Encounter.MOVEMENT_SPEED = 1.2;
Encounter.TURN_SPEED = 0.0007;
Encounter.SHOT_SPEED = 3.0;
Encounter.SHOT_INTERVAL_MS = 400;
Encounter.MAX_PLAYERS_SHOTS_ALLOWED = 5; // original has illusion of no shot limit or range limit, but max 3 on screen
Encounter.TIME_TO_SPAWN_ENEMY_MS = 3000; // TODO not measured on original
Encounter.TIME_TO_ENTER_PORTAL_MS = 12000; // TODO not measured
Encounter.ENEMY_SPAWN_DISTANCE_MAX = 10000; // not measured
Encounter.PORTAL_SPAWN_DISTANCE_MAX = 10000; // not measured

init3d(Grid.MAX_X * 1.4); // draw distance to see mostly the whole grid, whatever size that is
Sound.init();
Overlay.init();
State.init();

MY3.setupRStats(); // requires three renderer to be ready

document.body.appendChild(renderer.domElement);

initListeners();
animate();
