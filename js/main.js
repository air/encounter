'use strict';

// Import utility modules
import { log, random } from './modules/UTIL.js';
import * as C64 from './modules/C64.js';

// Test that our modules are working
log('ES6 modules loaded successfully');
log('Random test: ' + random(1, 10));
log('C64 white color: ' + C64.white);
log('Random C64 color: ' + C64.randomColour());

// For now, we'll import the rest as global scripts
// This will be our incremental migration approach

// TODO: Convert remaining files to modules
console.log('Main.js: Basic module system initialized');