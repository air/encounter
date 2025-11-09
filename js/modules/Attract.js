'use strict';

import * as Grid from './Grid.js';
import * as Radar from './Radar.js';
import Display from './Display.js';
import Indicators from './Indicators.js';
import { getThreeDiv } from './MY3.js';
import Keys from './Keys.js';
import Level from './Level.js';
import { log } from './UTIL.js';
import { resetShieldsLeft as Player_resetShieldsLeft } from './Player.js';
import { initLevel as State_initLevel, setupWaitForEnemy as State_setupWaitForEnemy } from './State.js';

export function init() {
  // no op
}

export function show() {
  Grid.removeFromScene();
  Display.removeFromScene();
  Radar.removeFromScene();
  Indicators.removeFromScene();
  getThreeDiv().style.display = 'none';
}

export function hide() {
  Grid.addToScene();
  Display.addToScene();
  Radar.addToScene();
  Indicators.addToScene();
  getThreeDiv().style.display = 'block';
}

export function update() {
  if (Keys.getShooting()) {
    Level.resetToBeginning();
    Player_resetShieldsLeft();
    State_initLevel();
    Keys.setShooting(false);

    hide();
    State_setupWaitForEnemy();
  } else if (Keys.getLevelRequested() > 0) {
    log('requested start on level ' + Keys.getLevelRequested());
    State_initLevel(Keys.getLevelRequested());
    hide();
    Keys.setLevelRequested(null);
    State_setupWaitForEnemy();
  }
}

// Export default object for backward compatibility
export default {
  init,
  show,
  hide,
  update
};