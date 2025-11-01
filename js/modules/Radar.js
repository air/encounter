/**
 * Radar.js - Mini-map radar display system
 * Canvas-based radar showing enemies, portals, and optional shots/obelisks
 */

import { ZINDEX_RADAR } from './Display.js';
import { css as C64css, randomCssColour } from './C64.js';
import { SPACING as Grid_SPACING, getViewport } from './Grid.js';
import { panic } from './UTIL.js';

// CLAUDE-TODO: Replace with actual Player import when Player.js is converted to ES6 module
const Player = {
  position: { x: 0, z: 0 },
  rotation: { y: 0 }
};

// CLAUDE-TODO: Replace with actual State import when State.js is converted to ES6 module
const State = {
  actors: { list: [] }
};

// Constants
export const RESOLUTION_X = 200;
export const RESOLUTION_Z = 200;
export const CROSSHAIR_RADIUS = 25;
export const RANGE = 20000; // world units from one side of the radar to the other (i.e. the diameter)

export const CENTER_X = Math.floor(RESOLUTION_X / 2);
export const CENTER_Z = Math.floor(RESOLUTION_Z / 2);

export const BLIP_RADIUS = 3;
export const OBELISK_BLIP_RADIUS = 1;

export let showObelisks = false; // in Encounter, false
export let showShots = true; // in Encounter, false

// Radar blip types
export const TYPE_PLAYER = 'player';
export const TYPE_ENEMY = 'enemy';
export const TYPE_SHOT = 'shot';
export const TYPE_PORTAL = 'portal';
export const TYPE_OBELISK = 'obelisk';
export const TYPE_NONE = 'none';

// CSS styling
const CSS_CENTRED_DIV = 'position:fixed; bottom:10px; width:100%';
const CSS_RADAR_DIV = 'opacity:1.0; margin-left:auto; margin-right:auto';

// Module state
let radarDiv = null; // for hide/show
let canvasContext = null; // for painting on

/**
 * Initialize the radar display system
 * Creates DOM elements and canvas context
 */
export function init() {
  // for centring at the bottom we need two divs, hurray!
  const centredDiv = document.createElement('div');
  centredDiv.id = 'centredRadarDiv';
  centredDiv.style.cssText = CSS_CENTRED_DIV;
  // set the z-index for all the radar divs in the parent div
  centredDiv.style.zIndex = ZINDEX_RADAR;

  radarDiv = document.createElement('div');
  radarDiv.id = 'radarDiv';
  radarDiv.style.cssText = CSS_RADAR_DIV;
  radarDiv.style.width = RESOLUTION_X + 'px';
  radarDiv.style.height = RESOLUTION_Z + 'px';
  radarDiv.style.display = 'none'; // off by default until shown

  const radar = document.createElement('canvas');
  radar.width = RESOLUTION_X;
  radar.height = RESOLUTION_Z;

  radarDiv.appendChild(radar);
  centredDiv.appendChild(radarDiv);
  document.body.appendChild(centredDiv);

  canvasContext = radar.getContext('2d');
  initCanvasClipRegion();
}

/**
 * Initialize the canvas clipping region for the octagonal radar shape
 */
function initCanvasClipRegion() {
  canvasContext.beginPath();
  canvasContext.moveTo(45, 0);
  canvasContext.lineTo(154, 0);
  canvasContext.lineTo(200, 45);
  canvasContext.lineTo(200, 154);
  canvasContext.lineTo(154, 200);
  canvasContext.lineTo(45, 200);
  canvasContext.lineTo(0, 154);
  canvasContext.lineTo(0, 45);
  canvasContext.closePath();
  canvasContext.clip();
}

/**
 * Show the radar display
 */
export function addToScene() {
  radarDiv.style.display = 'block';
}

/**
 * Hide the radar display
 */
export function removeFromScene() {
  radarDiv.style.display = 'none';
}

/**
 * Draw a blip on the radar at the given position
 * @param {number} x - X position on radar canvas
 * @param {number} z - Z position on radar canvas
 * @param {number} [blipSize] - Size of the blip (defaults to BLIP_RADIUS)
 */
function blip(x, z, blipSize) {
  const size = (blipSize === undefined) ? BLIP_RADIUS : blipSize;
  canvasContext.fillRect(x - size, z - size, size * 2, size * 2);
}

/**
 * Translate world position to radar position based on range
 * This limits the radar to only showing RANGE
 * @param {number} xPos - World X position
 * @param {number} zPos - World Z position
 * @returns {THREE.Vector2} Radar position
 */
function translatePositionByRange(xPos, zPos) {
  const x = (xPos / RANGE) * RESOLUTION_X;
  const z = (zPos / RANGE) * RESOLUTION_Z;
  return new window.THREE.Vector2(x, z);
}

/**
 * Render a blip at the given world coordinates
 * Transforms world position to player-relative radar position
 * @param {number} worldx - World X coordinate
 * @param {number} worldz - World Z coordinate
 * @param {number} [blipSize] - Size of the blip (optional)
 */
export function render(worldx, worldz, blipSize) {
  // translate so player is at origin
  const xRelativeToPlayer = worldx - Player.position.x;
  const zRelativeToPlayer = worldz - Player.position.z;

  // rotate, http://en.wikipedia.org/wiki/Rotation_(mathematics)#Matrix_algebra
  const x = (xRelativeToPlayer * Math.cos(Player.rotation.y)) - (zRelativeToPlayer * Math.sin(Player.rotation.y));
  const z = (xRelativeToPlayer * Math.sin(Player.rotation.y)) + (zRelativeToPlayer * Math.cos(Player.rotation.y));

  // scale for radar range
  const radarPos = translatePositionByRange(x, z);

  // paint relative to center (player)
  blip(CENTER_X + radarPos.x, CENTER_Z + radarPos.y, blipSize);
}

/**
 * Render obelisks on the radar (not done in the original)
 * Renders all obelisks in a square of size RANGE
 */
function renderRadarObelisks() {
  canvasContext.fillStyle = C64css.darkgrey;

  // start at player position and move to bottom right of radar range
  const xStart = Player.position.x - (RANGE / 2);
  const zStart = Player.position.z - (RANGE / 2);

  // starting at that point, find the first line of obelisks that we have to render
  const firstXLine = Math.ceil(xStart / Grid_SPACING) * Grid_SPACING;
  const firstZLine = Math.ceil(zStart / Grid_SPACING) * Grid_SPACING;

  for (let x = firstXLine; x < (firstXLine + RANGE); x += Grid_SPACING) {
    for (let z = firstZLine; z < (firstZLine + RANGE); z += Grid_SPACING) {
      render(x, z, OBELISK_BLIP_RADIUS);
    }
  }
}

/**
 * Alternative render: show all obelisks in the Grid.viewport
 * Not currently used
 */
export function renderViewportObelisks() {
  canvasContext.fillStyle = C64css.darkgrey;

  const viewport = getViewport();
  for (let x = viewport.min.x; x <= viewport.max.x; x += Grid_SPACING) {
    for (let z = viewport.min.y; z <= viewport.max.y; z += Grid_SPACING) {
      render(x, z, OBELISK_BLIP_RADIUS);
    }
  }
}

/**
 * Clear the radar canvas and draw crosshairs
 */
function clearCanvas() {
  canvasContext.fillStyle = C64css.black;
  canvasContext.fillRect(0, 0, RESOLUTION_X, RESOLUTION_Z);

  // crosshairs
  canvasContext.strokeStyle = C64css.grey;
  canvasContext.lineWidth = 4;
  canvasContext.moveTo(CENTER_X, CENTER_Z - CROSSHAIR_RADIUS);
  canvasContext.lineTo(CENTER_X, CENTER_Z + CROSSHAIR_RADIUS);
  canvasContext.moveTo(CENTER_X - CROSSHAIR_RADIUS, CENTER_Z);
  canvasContext.lineTo(CENTER_X + CROSSHAIR_RADIUS, CENTER_Z);
  canvasContext.stroke();
}

/**
 * Update the radar display
 * Clears canvas and renders all actors as blips
 */
export function update() {
  clearCanvas();

  // obelisks go underneath more important blips
  if (showObelisks) {
    renderRadarObelisks();
  }

  // render all actors as blips
  for (let i = 0; i < State.actors.list.length; i++) {
    // set the colour by actor type
    const type = State.actors.list[i].radarType;

    switch (type) {
      case TYPE_ENEMY:
        canvasContext.fillStyle = C64css.yellow;
        render(State.actors.list[i].getObject3D().position.x, State.actors.list[i].getObject3D().position.z);
        break;
      case TYPE_SHOT:
        if (showShots) {
          canvasContext.fillStyle = C64css.orange;
          render(State.actors.list[i].getObject3D().position.x, State.actors.list[i].getObject3D().position.z);
        }
        break;
      case TYPE_PORTAL:
        canvasContext.fillStyle = randomCssColour();
        render(State.actors.list[i].getObject3D().position.x, State.actors.list[i].getObject3D().position.z);
        break;
      case TYPE_NONE:
        // no op
        break;
      default:
        panic('unknown .radarType ' + type + ' for actor ' + State.actors.list[i]);
    }
  }
}

// Default export for backward compatibility
export default {
  RESOLUTION_X,
  RESOLUTION_Z,
  CROSSHAIR_RADIUS,
  RANGE,
  CENTER_X,
  CENTER_Z,
  BLIP_RADIUS,
  OBELISK_BLIP_RADIUS,
  showObelisks,
  showShots,
  TYPE_PLAYER,
  TYPE_ENEMY,
  TYPE_SHOT,
  TYPE_PORTAL,
  TYPE_OBELISK,
  TYPE_NONE,
  init,
  addToScene,
  removeFromScene,
  render,
  renderViewportObelisks,
  update
};
