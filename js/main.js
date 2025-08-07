'use strict';

// Import utility modules
import { log, random } from './modules/UTIL.js';
import * as C64 from './modules/C64.js';
import Timer from './modules/Timer.js';
import Sound from './modules/Sound.js';
import Level from './modules/Level.js';
import Keys from './modules/Keys.js';
import Display from './modules/Display.js';
import Indicators from './modules/Indicators.js';

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
Sound.playerShoot(); // Test playing a sound
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

// For now, we'll import the rest as global scripts
// This will be our incremental migration approach
// IMPORTANT: in the current state we are not actually loading or testing the game loop

// TODO: Convert remaining files to modules
console.log('Main.js: Basic module system initialized');
