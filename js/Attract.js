import { log, error, panic } from '/js/UTIL.js';

var Attract = {};

Attract.init = function()
{
  // no op
};

Attract.show = function()
{
  Grid.removeFromScene();
  Display.removeFromScene();
  Radar.removeFromScene();
  Indicators.removeFromScene();
  MY3.threeDiv.style.display = 'none';
};

Attract.hide = function()
{
  Grid.addToScene();
  Display.addToScene();
  Radar.addToScene();
  Indicators.addToScene();
  MY3.threeDiv.style.display = 'block';
};

Attract.update = function()
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
