'use strict';

import Display from './Display.js';
import Indicators from './Indicators.js';
import * as MY3 from './MY3.js';
import Keys from './Keys.js';
import Level from './Level.js';
import { log } from './UTIL.js';

// CLAUDE-TODO: These dependencies should be imported from their respective modules when converted
const Grid = {
  removeFromScene: () => console.log('Grid.removeFromScene called'),
  addToScene: () => console.log('Grid.addToScene called')
};

const Radar = {
  removeFromScene: () => console.log('Radar.removeFromScene called'),
  addToScene: () => console.log('Radar.addToScene called')
};

const Player = {
  resetShieldsLeft: () => console.log('Player.resetShieldsLeft called')
};

const State = {
  initLevel: (level) => console.log('State.initLevel called with level:', level),
  setupWaitForEnemy: () => console.log('State.setupWaitForEnemy called')
};

export function init() {
  // no op
}

export function show() {
  Grid.removeFromScene();
  Display.removeFromScene();
  Radar.removeFromScene();
  Indicators.removeFromScene();
  MY3.threeDiv.style.display = 'none';
}

export function hide() {
  Grid.addToScene();
  Display.addToScene();
  Radar.addToScene();
  Indicators.addToScene();
  MY3.threeDiv.style.display = 'block';
}

export function update() {
  if (Keys.shooting) {
    Level.resetToBeginning();
    Player.resetShieldsLeft();
    State.initLevel();
    Keys.shooting = false;

    hide();
    State.setupWaitForEnemy();
  } else if (Keys.levelRequested > 0) {
    log('requested start on level ' + Keys.levelRequested);
    State.initLevel(Keys.levelRequested);
    hide();
    Keys.levelRequested = null;
    State.setupWaitForEnemy(); 
  }
}

// Export default object for backward compatibility
export default {
  init,
  show,
  hide,
  update
};