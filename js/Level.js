import { log, error, panic } from '/js/UTIL.js';
import * as C64 from '/js/C64.js'
import * as Enemy from '/js/Enemy.js'

var Level = {};

Level.number = null;  // not to be changed directly, use functions
Level.current = null; // reference to current level data object

Level.data = [
  // level 1
  {
    skyColor : C64.css.lightblue,
    horizonColor : C64.css.blue,
    groundColor : C64.css.green,
    obeliskColor : C64.black,
    firstEnemy : Enemy.TYPE_SAUCER_SINGLE,
    enemyCount : 4,
    spawnTable : [
      Enemy.TYPE_MISSILE,
      Enemy.TYPE_SAUCER_SINGLE,
      Enemy.TYPE_SAUCER_TRIPLE,
    ]
  },
  // level 2
  {
    skyColor : C64.css.black,
    horizonColor : C64.css.black,
    groundColor : C64.css.brown,
    obeliskColor : C64.green,
    firstEnemy : Enemy.TYPE_SAUCER_TRIPLE,
    enemyCount : 6,
    spawnTable : [
      Enemy.TYPE_MISSILE,
      Enemy.TYPE_SAUCER_SINGLE,
      Enemy.TYPE_SAUCER_TRIPLE,
      Enemy.TYPE_SAUCER_CHAINGUN,
      Enemy.TYPE_SAUCER_SHOTGUN
    ]
  },
  // level 3
  {
    skyColor : C64.css.lightblue,
    horizonColor : C64.css.blue,
    groundColor : C64.css.lightred,
    obeliskColor : C64.black,
    firstEnemy : Enemy.TYPE_SAUCER_TRIPLE,
    enemyCount : 6,
    spawnTable : [
      Enemy.TYPE_MISSILE,
      Enemy.TYPE_SAUCER_TRIPLE,
      Enemy.TYPE_SAUCER_CHAINGUN,
      Enemy.TYPE_SAUCER_SHOTGUN,
      Enemy.TYPE_SAUCER_AUTOSHOTGUN
    ]
  },
  // level 4
  {
    skyColor : C64.css.black,
    horizonColor : C64.css.black,
    groundColor : C64.css.red,
    obeliskColor : C64.purple,
    firstEnemy : Enemy.TYPE_SAUCER_AUTOSHOTGUN,
    enemyCount : 6,
    spawnTable : [
      Enemy.TYPE_MISSILE,
      Enemy.TYPE_SAUCER_TRIPLE,
      Enemy.TYPE_SAUCER_CHAINGUN,
      Enemy.TYPE_SAUCER_SHOTGUN,
      Enemy.TYPE_SAUCER_AUTOSHOTGUN
    ]
  },
  // level 5
  {
    skyColor : C64.css.lightblue,
    horizonColor : C64.css.blue,
    groundColor : C64.css.grey,
    obeliskColor : C64.black,
    firstEnemy : Enemy.TYPE_SAUCER_CHAINGUN,
    enemyCount : 6,
    spawnTable : [
      Enemy.TYPE_MISSILE,
      Enemy.TYPE_SAUCER_TRIPLE,
      Enemy.TYPE_SAUCER_CHAINGUN,
      Enemy.TYPE_SAUCER_SHOTGUN,
      Enemy.TYPE_SAUCER_AUTOSHOTGUN
    ]
  },
  // level 6
  {
    skyColor : C64.css.orange,
    horizonColor : C64.css.lightred,
    groundColor : C64.css.brown,
    obeliskColor : C64.black,
    firstEnemy : Enemy.TYPE_SAUCER_TRIPLE,
    enemyCount : 6,
    spawnTable : [
      Enemy.TYPE_MISSILE,
      Enemy.TYPE_SAUCER_TRIPLE,
      Enemy.TYPE_SAUCER_CHAINGUN,
      Enemy.TYPE_SAUCER_SHOTGUN,
      Enemy.TYPE_SAUCER_AUTOSHOTGUN
    ]
  },
  // level 7
  {
    skyColor : C64.css.black,
    horizonColor : C64.css.black,
    groundColor : C64.css.lightblue,
    obeliskColor : C64.blue,
    firstEnemy : Enemy.TYPE_SAUCER_TRIPLE,
    enemyCount : 6,
    spawnTable : [
      Enemy.TYPE_MISSILE,
      Enemy.TYPE_SAUCER_TRIPLE,
      Enemy.TYPE_SAUCER_CHAINGUN,
      Enemy.TYPE_SAUCER_SHOTGUN,
      Enemy.TYPE_SAUCER_AUTOSHOTGUN
    ]
  },
  // level 8
  {
    skyColor : C64.css.lightred,
    horizonColor : C64.css.orange,
    groundColor : C64.css.red,
    obeliskColor : C64.black,
    firstEnemy : Enemy.TYPE_SAUCER_TRIPLE,
    enemyCount : 6,
    spawnTable : [
      Enemy.TYPE_MISSILE,
      Enemy.TYPE_SAUCER_TRIPLE,
      Enemy.TYPE_SAUCER_CHAINGUN,
      Enemy.TYPE_SAUCER_SHOTGUN,
      Enemy.TYPE_SAUCER_AUTOSHOTGUN
    ]
  },
];

Level.init = function()
{
  Level.resetToBeginning();
};

Level.nextLevel = function()
{
  Level.number += 1;
  Level.current = Level.data[Level.number - 1];
};

Level.resetToBeginning = function()
{
  Level.number = 1;
  Level.current = Level.data[Level.number - 1];
};

Level.set = function(number)
{
  if (number < 1 || number > 8)
  {
    throw('invalid level number: ' + number);
  }
  Level.number = number;
  Level.current = Level.data[Level.number - 1];
};
