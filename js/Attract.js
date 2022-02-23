import { log, error, panic } from '/js/UTIL.js';
import * as Grid from '/js/Grid.js'
import * as Display from '/js/Display.js'
import * as Radar from '/js/Radar.js'
import * as Indicators from '/js/Indicators.js'
import * as MY3 from '/js/MY3.js'
import * as Keys from '/js/Keys.js'
import * as State from '/js/State.js'

export function show()
{
  Grid.removeFromScene();
  Display.removeFromScene();
  Radar.removeFromScene();
  Indicators.removeFromScene();
  MY3.threeDiv.style.display = 'none';
};

export function hide()
{
  Grid.addToScene();
  Display.addToScene();
  Radar.addToScene();
  Indicators.addToScene();
  MY3.threeDiv.style.display = 'block';
};

export function update()
{
  if (Keys.shooting)
  {
    Level.resetToBeginning();
    Player.resetShieldsLeft();
    State.initLevel();
    Keys.shooting = false;

    Attract.hide();
    State.setupWaitForEnemy();
  }
  else if (Keys.levelRequested > 0)
  {
    log('requested start on level ' + Keys.levelRequested);
    State.initLevel(Keys.levelRequested);
    Attract.hide();
    Keys.levelRequested = null;
    State.setupWaitForEnemy();
  }
};
