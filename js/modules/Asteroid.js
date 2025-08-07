'use strict';

import * as C64 from './C64.js';
import * as UTIL from './UTIL.js';
import * as MY3 from './MY3.js';

// CLAUDE-TODO: These dependencies should be imported from their respective modules when converted
const Player = {
  position: { x: 0, y: 0, z: 0 },
  RADIUS: 30,
  wasHit: () => console.log('Player.wasHit called')
};

const Warp = {
  state: null,
  STATE_PLAYER_HIT: 'player_hit'
};

// Mock log function (should eventually come from UTIL or be globally available)
function log(msg) {
  console.log(msg);
}

export const RADIUS = 60;
export const GEOMETRY = new window.THREE.SphereGeometry(RADIUS, 16, 16);
export const BASE_MATERIAL = new window.THREE.MeshBasicMaterial({ color : C64.white });

export function newInstance() {
  var material = BASE_MATERIAL.clone();
  material.color = new window.THREE.Color(generateColor());
  var newAsteroid = new window.THREE.Mesh(GEOMETRY, material);
  return newAsteroid;
}

// anything but black
export function generateColor() {
  var color = C64.black;
  while (color === C64.black)
  {
    color = UTIL.randomFromArray(C64.palette);
  }
  return color;
}

export function collideWithPlayer(asteroidPosition) {
  if (MY3.doCirclesCollide(asteroidPosition, RADIUS, Player.position, Player.RADIUS))
  {
    log('player hit asteroid in warp');
    Player.wasHit();
    Warp.state = Warp.STATE_PLAYER_HIT;
  }
}

// Export default object for backward compatibility
export default {
  RADIUS,
  GEOMETRY,
  BASE_MATERIAL,
  newInstance,
  generateColor,
  collideWithPlayer
};