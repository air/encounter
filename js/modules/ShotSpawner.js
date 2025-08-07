'use strict';

import * as C64 from './C64.js';
import * as UTIL from './UTIL.js';
import * as MY3 from './MY3.js';
import Shot from './Shot.js';

// CLAUDE-TODO: These dependencies should be imported from their respective modules when converted
const Radar = {
  TYPE_ENEMY: 'enemy',
  TYPE_ENEMY_SHOT: 'enemy_shot'
};

const State = {
  actors: {
    add: (actor) => console.log('State.actors.add called with:', actor)
  }
};

const Actor = function(object3D, updateFunction, radarType) {
  this.object3D = object3D;
  this.update = updateFunction;
  this.radarType = radarType;
};

const clock = {
  oldTime: Date.now()
};

// A ShotSpawner is a visible Mesh that generates a bunch of Shots
export const MATERIAL = new window.THREE.MeshBasicMaterial({ color: C64.white });
export const SHOT_MATERIAL = new window.THREE.MeshBasicMaterial({ color: C64.cyan });

// Constructor function for ShotSpawner
// location is a Vector3 placement for the spawner
export default function ShotSpawner(location) {
  window.THREE.Mesh.call(this, Shot.GEOMETRY, SHOT_MATERIAL); // super constructor
  this.SHOT_INTERVAL_MILLIS = 100;
  this.lastShotAt = 0;
  this.position.copy(location);
  this.setRotationDegreesPerSecond(-45);
  this.radarType = Radar.TYPE_ENEMY;
}

// Set up prototype inheritance
ShotSpawner.prototype = Object.create(window.THREE.Mesh.prototype);
ShotSpawner.prototype.constructor = ShotSpawner;

// negative number to go clockwise
ShotSpawner.prototype.setRotationDegreesPerSecond = function(rate) {
  this.rotationRate = (rate * UTIL.TO_RADIANS) / 1000; // convert degrees per second to radians per ms
};

ShotSpawner.prototype.spawnShotIfNeeded = function(timeNow) {
  var timeSinceLastShot = timeNow - this.lastShotAt;
  if (timeSinceLastShot > this.SHOT_INTERVAL_MILLIS) {
    var direction = MY3.objectRotationAsUnitVector(this);
    var shotMesh = Shot.newMeshInstance(this.position, direction);
    State.actors.add(new Actor(shotMesh, shotMesh.update, Radar.TYPE_ENEMY_SHOT));
    this.lastShotAt = timeNow;
  }
};

ShotSpawner.prototype.update = function(timeDeltaMillis) {
  this.rotation.y += this.rotationRate * timeDeltaMillis;
  this.spawnShotIfNeeded(clock.oldTime);
};

// Export additional utilities
export { MATERIAL as ShotSpawnerMaterial, SHOT_MATERIAL as ShotMaterial };