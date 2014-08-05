'use strict';

var Attract = {};

Attract.init = function()
{
  // no op
};

Attract.show = function()
{
  Overlay.removeFromScene();
  Radar.removeFromScene();
  Indicators.removeFromScene();
  renderer.domElement.hidden = true;
};

Attract.hide = function()
{
  Overlay.addToScene();
  Radar.addToScene();
  Indicators.addToScene();
  renderer.domElement.hidden = false;
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
