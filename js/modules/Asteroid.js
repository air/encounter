'use strict';

import * as C64 from './C64.js';
import { randomFromArray } from './UTIL.js';
import { log } from './UTIL.js';
import * as MY3 from './MY3.js';
import { getPosition as Player_getPosition, RADIUS as Player_RADIUS, wasHit as Player_wasHit } from './Player.js';
import { STATE_PLAYER_HIT as Warp_STATE_PLAYER_HIT, setState as Warp_setState } from './Warp.js';

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
    color = randomFromArray(C64.palette);
  }
  return color;
}

export function collideWithPlayer(asteroidPosition) {
  if (MY3.doCirclesCollide(asteroidPosition, RADIUS, Player_getPosition(), Player_RADIUS))
  {
    log('player hit asteroid in warp');
    Player_wasHit();
    Warp_setState(Warp_STATE_PLAYER_HIT);
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