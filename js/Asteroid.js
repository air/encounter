import { log, error, panic } from '/js/UTIL.js';
import * as THREE from '/lib/three.module.js'
import * as C64 from '/js/C64.js'
import * as Player from '/js/Player.js'
import * as Warp from '/js/Warp.js'

export const RADIUS = 60;
export const GEOMETRY = new THREE.SphereGeometry(RADIUS, 16, 16);
export const BASE_MATERIAL = new THREE.MeshBasicMaterial({ color : C64.white });

export function newInstance()
{
  var material = BASE_MATERIAL.clone();
  material.color = new THREE.Color(generateColor());
  var newAsteroid = new THREE.Mesh(GEOMETRY, material);
  return newAsteroid;
};

// anything but black
function generateColor()
{
  var color = C64.black;
  while (color === C64.black)
  {
    color = UTIL.randomFromArray(C64.palette);
  }
  return color;
};

export function collideWithPlayer(asteroidPosition)
{
  if (MY3.doCirclesCollide(asteroidPosition, RADIUS, Player.position, Player.RADIUS))
  {
    log('player hit asteroid in warp');
    Player.wasHit();
    Warp.state = Warp.STATE_PLAYER_HIT;
  }
};
