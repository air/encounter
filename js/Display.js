'use strict';

var Display = {};

Display.ZINDEX_SKY = '1';
Display.ZINDEX_GROUND = '2';
Display.ZINDEX_HORIZON = '3';
Display.ZINDEX_CANVAS = '4'; // where the 3D view is painted
Display.ZINDEX_DASHBOARD = '5';
Display.ZINDEX_RADAR = '6';
Display.ZINDEX_INDICATORS = '7';
Display.ZINDEX_CROSSHAIRS = '8';
Display.ZINDEX_TEXT = '9';

Display.CROSSHAIR_WIDTH = 80;
Display.CROSSHAIR_HEIGHT = 60;
Display.CROSSHAIR_THICKNESS = 7;

Display.containerDiv = null;
Display.horizonDiv = null;
Display.aimDiv = null;
Display.skyDiv = null;

Display.init = function()
{
  Display.initText();
  Display.initSky();
  Display.initGround();
  Display.initHorizon();
  Display.initCrosshairs();
  Display.initDashboard();
};

Display.initDashboard = function()
{
  Display.dashboardDiv = document.createElement('div');
  Display.dashboardDiv.id = 'dashboard';
  Display.dashboardDiv.style.backgroundColor = C64.css.grey;
  Display.dashboardDiv.style.width = '100%';
  Display.dashboardDiv.style.height = '225px';
  Display.dashboardDiv.style.position = 'absolute';
  Display.dashboardDiv.style.bottom = '0px';
  Display.dashboardDiv.style.zIndex = Display.ZINDEX_DASHBOARD;
  Display.dashboardDiv.style.display = 'none';
  document.body.appendChild(Display.dashboardDiv);
};

Display.initSky = function()
{
  Display.skyDiv = document.createElement('div');
  Display.skyDiv.id = 'sky';
  Display.skyDiv.style.backgroundColor = C64.css.white; // dummy colour
  Display.skyDiv.style.position = 'absolute';
  Display.skyDiv.style.width = '100%';
  Display.skyDiv.style.height = '100%';
  Display.skyDiv.style.zIndex = Display.ZINDEX_SKY;
  Display.skyDiv.style.display = 'none'; // off by default until shown
  document.body.appendChild(Display.skyDiv);
};

Display.initGround = function()
{
  Display.groundDiv = document.createElement('div');
  Display.groundDiv.id = 'ground';
  Display.groundDiv.style.backgroundColor = C64.css.white; // dummy colour
  Display.groundDiv.style.position = 'absolute';
  Display.groundDiv.style.width = '100%';
  Display.groundDiv.style.height = '50%';
  Display.groundDiv.style.bottom = '0px';
  Display.groundDiv.style.zIndex = Display.ZINDEX_GROUND;
  Display.groundDiv.style.display = 'none'; // off by default until shown
  document.body.appendChild(Display.groundDiv);
};

Display.initHorizon = function()
{
  Display.horizonDiv = document.createElement('div');
  Display.horizonDiv.id = 'horizon';
  Display.horizonDiv.style.cssText = 'width=100%; height:4px; position:absolute; top:0; bottom:0; left:0; right:0; margin:auto;';
  Display.horizonDiv.style.zIndex = Display.ZINDEX_HORIZON;
  Display.horizonDiv.style.display = 'none'; // off by default until shown
  document.body.appendChild(Display.horizonDiv);
};

Display.initCrosshairs = function()
{
  Display.aimDiv = document.createElement('canvas');
  Display.aimDiv.id = 'crosshairs';
  // don't use CSS to set the size of a canvas, or you'll get scaling. Set direct on the element.
  Display.aimDiv.width = Display.CROSSHAIR_WIDTH;
  Display.aimDiv.height = Display.CROSSHAIR_HEIGHT;
  Display.aimDiv.style.cssText = 'position:absolute; top:0; bottom:0; left:0; right:0; margin:auto;';
  Display.aimDiv.style.zIndex = Display.ZINDEX_CROSSHAIRS;
  Display.aimDiv.style.display = 'none'; // off by default until shown

  // draw the crosshairs
  var canvas = Display.aimDiv.getContext('2d');
  canvas.fillStyle = C64.css.lightgrey;
  var serifLength = Display.CROSSHAIR_WIDTH / 5;
  // left
  canvas.fillRect(0, 0, serifLength, Display.CROSSHAIR_THICKNESS);
  canvas.fillRect(0, 0, Display.CROSSHAIR_THICKNESS, Display.CROSSHAIR_HEIGHT);
  canvas.fillRect(0, Display.CROSSHAIR_HEIGHT - Display.CROSSHAIR_THICKNESS, serifLength, Display.CROSSHAIR_THICKNESS);
  // right
  canvas.fillRect(Display.CROSSHAIR_WIDTH - serifLength, 0, serifLength, Display.CROSSHAIR_THICKNESS);
  canvas.fillRect(Display.CROSSHAIR_WIDTH - Display.CROSSHAIR_THICKNESS, 0, Display.CROSSHAIR_THICKNESS, Display.CROSSHAIR_HEIGHT);
  canvas.fillRect(Display.CROSSHAIR_WIDTH - serifLength, Display.CROSSHAIR_HEIGHT - Display.CROSSHAIR_THICKNESS, serifLength, Display.CROSSHAIR_THICKNESS);

  document.body.appendChild(Display.aimDiv);
};

Display.initText = function()
{
  // container div across whole screen, with style elements common to children
  Display.containerDiv = document.createElement('div');
  Display.containerDiv.id = 'Display';
  Display.containerDiv.style.cssText = 'width:100%; font-family:monospace; font-size:48px; font-weight:bold; text-align:center'
  Display.containerDiv.style.color = C64.css.white;
  Display.containerDiv.style.backgroundColor = C64.css.grey;
  Display.containerDiv.style.display = 'none'; // off by default until shown
  Display.containerDiv.style.zIndex = Display.ZINDEX_TEXT;

  Display.score = document.createElement('div');
  Display.score.id = 'score';
  Display.score.style.cssText = 'width:25%; float:left';
  Display.containerDiv.appendChild(Display.score);

  Display.level = document.createElement('div');
  Display.level.id = 'level';
  Display.level.style.cssText = 'width:25%; float:left';
  Display.containerDiv.appendChild(Display.level);

  Display.enemies = document.createElement('div');
  Display.enemies.id = 'enemies';
  Display.enemies.style.cssText = 'width:25%; float:left';
  Display.containerDiv.appendChild(Display.enemies);

  Display.shields = document.createElement('div');
  Display.shields.id = 'shields';
  Display.shields.style.cssText = 'width:25%; float:left';
  Display.containerDiv.appendChild(Display.shields);

  // place the Display in the page
  Display.containerDiv.style.position = 'absolute';
  Display.containerDiv.style.top = '0px';
  document.body.appendChild(Display.containerDiv);
};

Display.update = function()
{
  switch (State.current)
  {
    case State.COMBAT:
    case State.WAIT_FOR_ENEMY:
    case State.WAIT_FOR_PORTAL:
      Display.score.innerHTML = ('0000000' + State.score).slice(-7);
      Display.level.innerHTML = 'L' + Level.number;
      Display.enemies.innerHTML = 'E' + ('00' + State.enemiesRemaining).slice(-2);
      Display.shields.innerHTML = 'S' + Player.shieldsLeft;
      break;
    default:
      panic('unknown state: ', State.current);
  }
};

Display.removeFromScene = function()
{
  Display.containerDiv.style.display = 'none';
  Display.horizonDiv.style.display = 'none';
  Display.groundDiv.style.display = 'none';
  Display.aimDiv.style.display = 'none';
  Display.skyDiv.style.display = 'none';
  Display.dashboardDiv.style.display = 'none';
};

Display.addToScene = function()
{
  Display.containerDiv.style.display = 'block';
  Display.horizonDiv.style.display = 'block';
  Display.groundDiv.style.display = 'block';
  Display.aimDiv.style.display = 'block';
  Display.skyDiv.style.display = 'block';
  Display.dashboardDiv.style.display = 'block';
};

Display.setSkyColour = function(cssColour)
{
  Display.skyDiv.style.backgroundColor = cssColour;
};

Display.setHorizonColour = function(cssColour)
{
  Display.horizonDiv.style.backgroundColor = cssColour;
};

Display.showShieldLossStatic = function()
{
  Display.setSkyColour(C64.css.white);
  Display.setHorizonColour(C64.css.white);
  Ground.setColor(C64.css.white);
};

Display.hideShieldLossStatic = function()
{
  Display.setSkyColour(Level.current.skyColor);
  Display.setHorizonColour(Level.current.horizonColor);
  Ground.setColor(Level.current.groundColor);
};

Display.updateShieldLossStatic = function()
{
  Display.setSkyColour(C64.randomCssColour());
  Display.setHorizonColour(C64.randomCssColour());
  Ground.setColor(C64.randomCssColour());
};
