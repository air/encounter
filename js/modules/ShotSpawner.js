'use strict';

import * as C64 from './C64.js';
import * as UTIL from './UTIL.js';
import * as Shot from './Shot.js';
import { TYPE_ENEMY } from './Radar.js';

// CLAUDE-TODO: Replace with actual State import when State.js is converted to ES6 module
const State = {
  actors: {
    add: (actor) => console.log('State.actors.add called with:', actor)
  }
};

// CLAUDE-TODO: Replace with actual clock import when converted to ES6 module
const clock = {
  oldTime: 0
};

// A ShotSpawner is a visible Mesh that generates a bunch of Shots

export const MATERIAL = new window.THREE.MeshBasicMaterial({ color: C64.white });
export const SHOT_MATERIAL = new window.THREE.MeshBasicMaterial({ color: C64.cyan });

// location is a Vector3 placement for the spawner
export default function ShotSpawner(location) {
  window.THREE.Mesh.call(this, Shot.GEOMETRY, SHOT_MATERIAL); // super constructor
  this.SHOT_INTERVAL_MILLIS = 100;
  this.lastShotAt = 0;
  this.position.copy(location);
  this.setRotationDegreesPerSecond(-45);
  this.radarType = TYPE_ENEMY;
}

ShotSpawner.prototype = Object.create(window.THREE.Mesh.prototype); // inheritance style from THREE

// negative number to go clockwise
ShotSpawner.prototype.setRotationDegreesPerSecond = function(degreesPerSecond) {
  this.ROTATE_RADIANS_PER_MS = (degreesPerSecond / 1000) * UTIL.TO_RADIANS;
};

ShotSpawner.prototype.update = function(t) {
  var rotateRadians = t * this.ROTATE_RADIANS_PER_MS;
  this.rotateOnAxis(new window.THREE.Vector3(0,1,0), rotateRadians);

  var timeNow = clock.oldTime;
  var millisSinceLastShot = timeNow - this.lastShotAt;
  if (millisSinceLastShot > this.SHOT_INTERVAL_MILLIS)
  {
    var shot = Shot.newInstance(this, this.position, this.rotation, SHOT_MATERIAL);
    State.actors.add(shot);

    this.lastShotAt = timeNow;
  }
};