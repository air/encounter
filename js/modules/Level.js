'use strict';

import * as C64 from './C64.js';
import {
  TYPE_MISSILE,
  TYPE_SAUCER_SINGLE,
  TYPE_SAUCER_TRIPLE,
  TYPE_SAUCER_CHAINGUN,
  TYPE_SAUCER_SHOTGUN,
  TYPE_SAUCER_AUTOSHOTGUN
} from './Enemy.js';

let number = null;  // not to be changed directly, use functions
let current = null; // reference to current level data object

export const data = [
  // level 1
  {
    skyColor : C64.css.lightblue,
    horizonColor : C64.css.blue,
    groundColor : C64.css.green,
    obeliskColor : C64.black,
    firstEnemy : TYPE_SAUCER_SINGLE,
    enemyCount : 4,
    spawnTable : [
      TYPE_MISSILE,
      TYPE_SAUCER_SINGLE,
      TYPE_SAUCER_TRIPLE,
    ]
  },
  // level 2
  {
    skyColor : C64.css.black,
    horizonColor : C64.css.black,
    groundColor : C64.css.brown,
    obeliskColor : C64.green,
    firstEnemy : TYPE_SAUCER_TRIPLE,
    enemyCount : 6,
    spawnTable : [
      TYPE_MISSILE,
      TYPE_SAUCER_SINGLE,
      TYPE_SAUCER_TRIPLE,
      TYPE_SAUCER_CHAINGUN,
      TYPE_SAUCER_SHOTGUN
    ]
  },
  // level 3
  {
    skyColor : C64.css.lightblue,
    horizonColor : C64.css.blue,
    groundColor : C64.css.lightred,
    obeliskColor : C64.black,
    firstEnemy : TYPE_SAUCER_TRIPLE,
    enemyCount : 6,
    spawnTable : [
      TYPE_MISSILE,
      TYPE_SAUCER_TRIPLE,
      TYPE_SAUCER_CHAINGUN,
      TYPE_SAUCER_SHOTGUN,
      TYPE_SAUCER_AUTOSHOTGUN
    ]
  },
  // level 4
  {
    skyColor : C64.css.black,
    horizonColor : C64.css.black,
    groundColor : C64.css.red,
    obeliskColor : C64.purple,
    firstEnemy : TYPE_SAUCER_AUTOSHOTGUN,
    enemyCount : 6,
    spawnTable : [
      TYPE_MISSILE,
      TYPE_SAUCER_TRIPLE,
      TYPE_SAUCER_CHAINGUN,
      TYPE_SAUCER_SHOTGUN,
      TYPE_SAUCER_AUTOSHOTGUN
    ]
  },
  // level 5
  {
    skyColor : C64.css.lightblue,
    horizonColor : C64.css.blue,
    groundColor : C64.css.grey,
    obeliskColor : C64.black,
    firstEnemy : TYPE_SAUCER_CHAINGUN,
    enemyCount : 6,
    spawnTable : [
      TYPE_MISSILE,
      TYPE_SAUCER_TRIPLE,
      TYPE_SAUCER_CHAINGUN,
      TYPE_SAUCER_SHOTGUN,
      TYPE_SAUCER_AUTOSHOTGUN
    ]
  },
  // level 6
  {
    skyColor : C64.css.orange,
    horizonColor : C64.css.lightred,
    groundColor : C64.css.brown,
    obeliskColor : C64.black,
    firstEnemy : TYPE_SAUCER_TRIPLE,
    enemyCount : 6,
    spawnTable : [
      TYPE_MISSILE,
      TYPE_SAUCER_TRIPLE,
      TYPE_SAUCER_CHAINGUN,
      TYPE_SAUCER_SHOTGUN,
      TYPE_SAUCER_AUTOSHOTGUN
    ]
  },
  // level 7
  {
    skyColor : C64.css.black,
    horizonColor : C64.css.black,
    groundColor : C64.css.lightblue,
    obeliskColor : C64.blue,
    firstEnemy : TYPE_SAUCER_TRIPLE,
    enemyCount : 6,
    spawnTable : [
      TYPE_MISSILE,
      TYPE_SAUCER_TRIPLE,
      TYPE_SAUCER_CHAINGUN,
      TYPE_SAUCER_SHOTGUN,
      TYPE_SAUCER_AUTOSHOTGUN
    ]
  },
  // level 8
  {
    skyColor : C64.css.lightred,
    horizonColor : C64.css.orange,
    groundColor : C64.css.red,
    obeliskColor : C64.black,
    firstEnemy : TYPE_SAUCER_TRIPLE,
    enemyCount : 6,
    spawnTable : [
      TYPE_MISSILE,
      TYPE_SAUCER_TRIPLE,
      TYPE_SAUCER_CHAINGUN,
      TYPE_SAUCER_SHOTGUN,
      TYPE_SAUCER_AUTOSHOTGUN
    ]
  },
];

export function init() {
  resetToBeginning();
}

export function nextLevel() {
  number += 1;
  current = data[number - 1];
}

export function resetToBeginning() {
  number = 1;
  current = data[number - 1];
}

export function set(levelNumber) {
  if (levelNumber < 1 || levelNumber > 8)
  {
    throw('invalid level number: ' + levelNumber);
  }
  number = levelNumber;
  current = data[number - 1];
}

export function getNumber() {
  return number;
}

export function getCurrent() {
  return current;
}

// Export default object for backward compatibility
export default {
  data,
  get number() { return number; },
  get current() { return current; },
  init,
  nextLevel,
  resetToBeginning,
  set,
  getNumber,
  getCurrent
};