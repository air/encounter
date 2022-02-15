import { log, error, panic } from '/js/UTIL.js';
import * as C64 from '/js/C64.js'
import * as Player from '/js/Player.js'
import * as State from '/js/State.js'
import * as Level from '/js/Level.js'
import * as Ground from '/js/Ground.js'

const ZINDEX_SKY = '1';
const ZINDEX_GROUND = '2';
const ZINDEX_HORIZON = '3';
const ZINDEX_CANVAS = '4'; // where the 3D view is painted
const ZINDEX_DASHBOARD = '5';
const ZINDEX_RADAR = '6';
const ZINDEX_INDICATORS = '7';
const ZINDEX_CROSSHAIRS = '8';
const ZINDEX_TEXT = '9';

const CROSSHAIR_WIDTH = 80;
const CROSSHAIR_HEIGHT = 60;
const CROSSHAIR_THICKNESS = 7;

// div elements
var containerDiv, groundDiv, horizonDiv, aimDiv, skyDiv, dashboardDiv, leftDashDiv, rightDashDiv;
// info elements
var score, level, enemies, shields;

export function init()
{
  initText();
  initSky();
  initGround();
  initHorizon();
  initCrosshairs();
  initDashboard();
};

function initDashboard()
{
  dashboardDiv = document.createElement('div');
  dashboardDiv.id = 'dashboard';
  dashboardDiv.style.backgroundColor = C64.css.grey;
  dashboardDiv.style.width = '100%';
  dashboardDiv.style.height = '225px';
  dashboardDiv.style.position = 'absolute';
  dashboardDiv.style.bottom = '0px';
  dashboardDiv.style.zIndex = ZINDEX_DASHBOARD;
  dashboardDiv.style.display = 'none';
  document.body.appendChild(dashboardDiv);

  leftDashDiv = document.createElement('div');
  leftDashDiv.id = 'leftdash';
  leftDashDiv.style.backgroundColor = C64.css.grey;
  leftDashDiv.style.width = '25px';
  leftDashDiv.style.height = '100%';
  leftDashDiv.style.position = 'absolute';
  leftDashDiv.style.left = '0px';
  leftDashDiv.style.zIndex = ZINDEX_DASHBOARD;
  leftDashDiv.style.display = 'none';
  document.body.appendChild(leftDashDiv);

  rightDashDiv = document.createElement('div');
  rightDashDiv.id = 'rightdash';
  rightDashDiv.style.backgroundColor = C64.css.grey;
  rightDashDiv.style.width = '25px';
  rightDashDiv.style.height = '100%';
  rightDashDiv.style.position = 'absolute';
  rightDashDiv.style.right = '0px';
  rightDashDiv.style.zIndex = ZINDEX_DASHBOARD;
  rightDashDiv.style.display = 'none';
  document.body.appendChild(rightDashDiv);
};

function initSky()
{
  skyDiv = document.createElement('div');
  skyDiv.id = 'sky';
  skyDiv.style.backgroundColor = C64.css.white; // dummy colour
  skyDiv.style.position = 'absolute';
  skyDiv.style.width = '100%';
  skyDiv.style.height = '100%';
  skyDiv.style.zIndex = ZINDEX_SKY;
  skyDiv.style.display = 'none'; // off by default until shown
  document.body.appendChild(skyDiv);
};

function initGround()
{
  groundDiv = document.createElement('div');
  groundDiv.id = 'ground';
  groundDiv.style.backgroundColor = C64.css.white; // dummy colour
  groundDiv.style.position = 'absolute';
  groundDiv.style.width = '100%';
  groundDiv.style.height = '50%';
  groundDiv.style.bottom = '0px';
  groundDiv.style.zIndex = ZINDEX_GROUND;
  groundDiv.style.display = 'none'; // off by default until shown
  document.body.appendChild(groundDiv);
};

function initHorizon()
{
  horizonDiv = document.createElement('div');
  horizonDiv.id = 'horizon';
  horizonDiv.style.cssText = 'width=100%; height:4px; position:absolute; top:0; bottom:0; left:0; right:0; margin:auto;';
  horizonDiv.style.zIndex = ZINDEX_HORIZON;
  horizonDiv.style.display = 'none'; // off by default until shown
  document.body.appendChild(horizonDiv);
};

function initCrosshairs()
{
  aimDiv = document.createElement('canvas');
  aimDiv.id = 'crosshairs';
  // don't use CSS to set the size of a canvas, or you'll get scaling. Set direct on the element.
  aimDiv.width = CROSSHAIR_WIDTH;
  aimDiv.height = CROSSHAIR_HEIGHT;
  aimDiv.style.cssText = 'position:absolute; top:0; bottom:0; left:0; right:0; margin:auto;';
  aimDiv.style.zIndex = ZINDEX_CROSSHAIRS;
  aimDiv.style.display = 'none'; // off by default until shown

  // draw the crosshairs
  var canvas = aimDiv.getContext('2d');
  canvas.fillStyle = C64.css.lightgrey;
  var serifLength = CROSSHAIR_WIDTH / 5;
  // left
  canvas.fillRect(0, 0, serifLength, CROSSHAIR_THICKNESS);
  canvas.fillRect(0, 0, CROSSHAIR_THICKNESS, CROSSHAIR_HEIGHT);
  canvas.fillRect(0, CROSSHAIR_HEIGHT - CROSSHAIR_THICKNESS, serifLength, CROSSHAIR_THICKNESS);
  // right
  canvas.fillRect(CROSSHAIR_WIDTH - serifLength, 0, serifLength, CROSSHAIR_THICKNESS);
  canvas.fillRect(CROSSHAIR_WIDTH - CROSSHAIR_THICKNESS, 0, CROSSHAIR_THICKNESS, CROSSHAIR_HEIGHT);
  canvas.fillRect(CROSSHAIR_WIDTH - serifLength, CROSSHAIR_HEIGHT - CROSSHAIR_THICKNESS, serifLength, CROSSHAIR_THICKNESS);

  document.body.appendChild(aimDiv);
};

function initText()
{
  // container div across whole screen, with style elements common to children
  containerDiv = document.createElement('div');
  containerDiv.id = 'Display';
  containerDiv.style.cssText = 'width:100%; font-family:monospace; font-size:48px; font-weight:bold; text-align:center'
  containerDiv.style.color = C64.css.white;
  containerDiv.style.backgroundColor = C64.css.grey;
  containerDiv.style.display = 'none'; // off by default until shown
  containerDiv.style.zIndex = ZINDEX_TEXT;

  score = document.createElement('div');
  score.id = 'score';
  score.style.cssText = 'width:25%; float:left';
  containerDiv.appendChild(score);

  level = document.createElement('div');
  level.id = 'level';
  level.style.cssText = 'width:25%; float:left';
  containerDiv.appendChild(level);

  enemies = document.createElement('div');
  enemies.id = 'enemies';
  enemies.style.cssText = 'width:25%; float:left';
  containerDiv.appendChild(enemies);

  shields = document.createElement('div');
  shields.id = 'shields';
  shields.style.cssText = 'width:25%; float:left';
  containerDiv.appendChild(shields);

  // place the Display in the page
  containerDiv.style.position = 'absolute';
  containerDiv.style.top = '0px';
  document.body.appendChild(containerDiv);
};

export function update()
{
  switch (State.current)
  {
    case State.COMBAT:
    case State.WAIT_FOR_ENEMY:
    case State.WAIT_FOR_PORTAL:
      score.innerHTML = ('0000000' + State.score).slice(-7);
      level.innerHTML = 'L' + Level.number;
      enemies.innerHTML = 'E' + ('00' + State.enemiesRemaining).slice(-2);
      shields.innerHTML = 'S' + Player.shieldsLeft;
      break;
    default:
      panic('unknown state: ', State.current);
  }
};

export function removeFromScene()
{
  containerDiv.style.display = 'none';
  horizonDiv.style.display = 'none';
  groundDiv.style.display = 'none';
  aimDiv.style.display = 'none';
  skyDiv.style.display = 'none';
  dashboardDiv.style.display = 'none';
  leftDashDiv.style.display = 'none';
  rightDashDiv.style.display = 'none';
};

export function addToScene()
{
  containerDiv.style.display = 'block';
  horizonDiv.style.display = 'block';
  groundDiv.style.display = 'block';
  aimDiv.style.display = 'block';
  skyDiv.style.display = 'block';
  dashboardDiv.style.display = 'block';
  leftDashDiv.style.display = 'block';
  rightDashDiv.style.display = 'block';
};

export function setSkyColour(cssColour)
{
  skyDiv.style.backgroundColor = cssColour;
};

export function setHorizonColour(cssColour)
{
  horizonDiv.style.backgroundColor = cssColour;
};

export function showShieldLossStatic()
{
  setSkyColour(C64.css.white);
  setHorizonColour(C64.css.white);
  Ground.setColor(C64.css.white);
};

export function hideShieldLossStatic()
{
  setSkyColour(Level.current.skyColor);
  setHorizonColour(Level.current.horizonColor);
  Ground.setColor(Level.current.groundColor);
};

export function updateShieldLossStatic()
{
  setSkyColour(C64.randomCssColour());
  setHorizonColour(C64.randomCssColour());
  Ground.setColor(C64.randomCssColour());
};
