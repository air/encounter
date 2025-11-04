'use strict';

import * as C64 from './C64.js';
import { platformSupportsTouch } from './UTIL.js';
import { ZINDEX_INDICATORS } from './Display.js';

// sizes all in pixels
// Note: WIDTH and X_SEPARATION are mutable (adjusted for touch) so not exported as constants
let WIDTH = 200;
export const HEIGHT = 50;
let X_SEPARATION = 300;
export const Y_SEPARATION = 25;
export const BORDER_WIDTH = 6; // black border around lights

export const CSS_CENTRED_DIV = 'position:fixed; bottom:10px; width:100%';
export const CSS_LIGHTS_DIV = 'margin-left:auto; margin-right:auto';

export const FLICKER_FRAMES = 2; // when flickering, show each colour for this many frames

let frameCounter = null; // current flicker timer
let isRedOn = true;  // current flicker state
let lightsDiv = null; // for hide/show
let canvasContext = null; // for painting on

// on/off state of indicators
let red = false;
let yellow = false;
let blue = false;

export function init() {
  if (platformSupportsTouch())
  {
    adjustForTouch();
  }

  var centredDiv = document.createElement('div');
  centredDiv.id = 'centredLightsDiv';
  centredDiv.style.cssText = CSS_CENTRED_DIV;
  // set the z-index for all the indicator divs in the parent div
  centredDiv.style.zIndex = ZINDEX_INDICATORS;

  // figure out how big our draw area is for the lights
  var width = (WIDTH * 2) + X_SEPARATION;
  var height = (HEIGHT * 3) + (Y_SEPARATION * 2);

  lightsDiv = document.createElement('div');
  lightsDiv.id = 'lightsDiv';
  lightsDiv.style.cssText = CSS_LIGHTS_DIV;
  lightsDiv.style.width = width + 'px';
  lightsDiv.style.height = height + 'px';
  lightsDiv.style.display = 'none';  // off by default until shown

  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  lightsDiv.appendChild(canvas);
  centredDiv.appendChild(lightsDiv);
  document.body.appendChild(centredDiv);

  canvasContext = canvas.getContext('2d');

  initBorders();
  paint();
}

// just draw black rects where the lights will be
function initBorders() {
  canvasContext.fillStyle = C64.css.black;
  for (var row = 0; row <=2; row++)
  {
    // left column
    canvasContext.fillRect(0,
      (HEIGHT * row) + (Y_SEPARATION * row),
      WIDTH,
      HEIGHT);
    // right column
    canvasContext.fillRect(WIDTH + X_SEPARATION,
      (HEIGHT * row) + (Y_SEPARATION * row),
      WIDTH,
      HEIGHT);
  }
}

function adjustForTouch() {
  WIDTH = 50;
  X_SEPARATION = 230;
}

export function addToScene() {
  lightsDiv.style.display = 'block';
}

export function removeFromScene() {
  lightsDiv.style.display = 'none';
}

export function setYellow(state) {
  yellow = state;
  paint();
}

export function setRed(state) {
  red = state;
  paint();
}

export function setBlue(state) {
  blue = state;
  paint();
}

// row is 0, 1, 2 for top, middle, bottom.
function paintRowWithColour(row, colour) {
  canvasContext.fillStyle = colour;
  // left column
  canvasContext.fillRect(BORDER_WIDTH,
    (HEIGHT * row) + (Y_SEPARATION * row) + BORDER_WIDTH,
    WIDTH - BORDER_WIDTH * 2,
    HEIGHT - BORDER_WIDTH * 2);
  // right column
  canvasContext.fillRect(WIDTH + X_SEPARATION + BORDER_WIDTH,
    (HEIGHT * row) + (Y_SEPARATION * row) + BORDER_WIDTH,
    WIDTH - BORDER_WIDTH * 2,
    HEIGHT - BORDER_WIDTH * 2);
}

function paintRed() {
  // default state is dull red = off
  var currentRedColour = C64.css.red;

  if (red)
  {
    // set colour according to flicker state
    currentRedColour = isRedOn ? C64.css.lightred : C64.css.red;
    // advance the flicker state
    frameCounter += 1;
    if (frameCounter === FLICKER_FRAMES)
    {
      isRedOn = !isRedOn;
      frameCounter = 0;
    }
  }

  paintRowWithColour(0, currentRedColour);
}

function paint() {
  paintRed();
  paintRowWithColour(1, yellow ? C64.css.yellow : C64.css.orange);
  paintRowWithColour(2, blue ? C64.css.lightblue : C64.css.blue);
}

export function update() {
  if (red) // don't repaint unless there's some flickering work to do
  {
    paintRed();
  }
}

export function reset() {
  setRed(false);
  setYellow(false);
  setBlue(false);
}

export function getRed() {
  return red;
}

export function getYellow() {
  return yellow;
}

export function getBlue() {
  return blue;
}

// Export default object for backward compatibility
export default {
  HEIGHT,
  Y_SEPARATION,
  BORDER_WIDTH,
  CSS_CENTRED_DIV,
  CSS_LIGHTS_DIV,
  FLICKER_FRAMES,
  init,
  addToScene,
  removeFromScene,
  setYellow,
  setRed,
  setBlue,
  update,
  reset,
  getRed,
  getYellow,
  getBlue
};