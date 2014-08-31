'use strict';

var Attract = {};

Attract.init = function()
{
  // no op
};

Attract.show = function()
{
  Grid.removeFromScene();
  Overlay.removeFromScene();
  Radar.removeFromScene();
  Indicators.removeFromScene();
  MY3.threeDiv.style.display = 'none';
};

Attract.hide = function()
{
  Grid.addToScene();
  Overlay.addToScene();
  Radar.addToScene();
  Indicators.addToScene();
  MY3.threeDiv.style.display = 'block';
};

Attract.update = function()
{
  if (Keys.shooting)
  {
    State.initLevel();
    Attract.hide();
    Keys.shooting = false;
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
