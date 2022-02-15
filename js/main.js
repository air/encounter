import { log, error, panic } from '/js/UTIL.js';
import * as Encounter from '/js/Encounter.js';
import * as MY3 from '/js/MY3.js';
import * as State from '/js/State.js';
import * as Display from '/js/Display.js';

// debug: export modules to console
import * as THREE from '/lib/three.module.js';
window.THREE = THREE;
window.MY3 = MY3;

// set the draw distance and the CSS z-index of the canvas
MY3.init3d(Encounter.DRAW_DISTANCE * 3, Display.ZINDEX_CANVAS);

State.init();

// MY3.setupRStats(); // requires three renderer to be ready
// MY3.startAnimationLoop();
