'use strict';

// constants modelling the original game.
// time for complete rotation: 9s
// time to pass 10 obelisks: 8s
var Encounter = {};
Encounter.DRAW_DISTANCE = 3000; // use with init3D() for the real C64 draw distance
Encounter.CAMERA_HEIGHT = Obelisk.HEIGHT / 2;
Encounter.PLAYER_LIVES = 4;
Encounter.MOVEMENT_SPEED = 1.2;
Encounter.TURN_SPEED = 0.0007;
Encounter.SHOT_SPEED = 2.8;
Encounter.SHOT_INTERVAL_MS = 400; // Player shot interval, as opposed to Enemy's
Encounter.MAX_PLAYERS_SHOTS_ALLOWED = 15; // original has illusion of no shot limit or range limit, but max 3 on screen
Encounter.TIME_TO_SPAWN_ENEMY_MS = 3000; // TODO not measured on original
Encounter.TIME_TO_ENTER_PORTAL_MS = 12000; // TODO not measured
Encounter.ENEMY_SPAWN_DISTANCE_MAX = 10000; // not measured
Encounter.PORTAL_SPAWN_DISTANCE_MAX = 10000; // not measured
Encounter.MISSILE_SPAWN_DISTANCE_MIN = 8000; // not measured
Encounter.PLAYER_INITIAL_ROTATION = 0.259;
Encounter.PLAYER_DEATH_TIMEOUT_MS = 2000; // time before you can play once being hit
Encounter.PLAYER_MAX_SHIELDS = 9; // from instruction manual

// set the draw distance and the CSS z-index of the canvas
MY3.init3d(Encounter.DRAW_DISTANCE * 3, Display.ZINDEX_CANVAS);

State.init();

MY3.setupRStats(); // requires three renderer to be ready
MY3.startAnimationLoop();
