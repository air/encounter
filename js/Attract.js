'use strict';

var Attract = {};

Attract.init = function()
{
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