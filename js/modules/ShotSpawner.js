'use strict';

import * as C64 from './C64.js';
import * as UTIL from './UTIL.js';
import * as Shot from './Shot.js';
import { TYPE_ENEMY } from './Radar.js';
import { getClock } from './MY3.js';
import { getActors } from './State.js';

// A ShotSpawner is a visible Mesh that generates a bunch of Shots

export const MATERIAL = new window.THREE.MeshBasicMaterial({ color: C64.white });
export const SHOT_MATERIAL = new window.THREE.MeshBasicMaterial({ color: C64.cyan });

// location is a Vector3 placement for the spawner
export default class ShotSpawner extends window.THREE.Mesh {
  constructor(location) {
    super(Shot.GEOMETRY, SHOT_MATERIAL);
    this.SHOT_INTERVAL_MILLIS = 100;
    this.lastShotAt = 0;
    this.position.copy(location);
    this.setRotationDegreesPerSecond(-45);
    this.radarType = TYPE_ENEMY;
  }

  // negative number to go clockwise
  setRotationDegreesPerSecond(degreesPerSecond) {
    this.ROTATE_RADIANS_PER_MS = (degreesPerSecond / 1000) * UTIL.TO_RADIANS;
  }

  update(t) {
    var rotateRadians = t * this.ROTATE_RADIANS_PER_MS;
    this.rotateOnAxis(new window.THREE.Vector3(0,1,0), rotateRadians);

    var timeNow = getClock().oldTime;
    var millisSinceLastShot = timeNow - this.lastShotAt;
    if (millisSinceLastShot > this.SHOT_INTERVAL_MILLIS)
    {
      var shot = Shot.newInstance(this, this.position, this.rotation, SHOT_MATERIAL);
      getActors().add(shot);

      this.lastShotAt = timeNow;
    }
  }
}