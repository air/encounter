'use strict';

var Level = {};

Level.number = null;  // not to be changed directly, use functions
Level.current = null; // reference to current level data object

Level.data = [
  // level 1
  {
    backgroundColor : C64.css.lightblue,
    groundColor : C64.green,
    obeliskColor : C64.black,
    firstEnemy : Enemy.TYPE_SAUCER_YELLOW,
    enemyCount : 4,
    spawnTable : [
      Enemy.TYPE_MISSILE,
      Enemy.TYPE_SAUCER_YELLOW,
      Enemy.TYPE_SAUCER_BLUE,
    ]
  },
  // level 2
  {
    backgroundColor : C64.css.black,
    groundColor : C64.brown,
    obeliskColor : C64.green,
    firstEnemy : Enemy.TYPE_SAUCER_BLUE,
    enemyCount : 6,
    spawnTable : [
      Enemy.TYPE_MISSILE,
      Enemy.TYPE_SAUCER_YELLOW,
      Enemy.TYPE_SAUCER_BLUE,
      Enemy.TYPE_SAUCER_BLUE
    ]
  },
  // level 3
  {
    backgroundColor : C64.css.lightblue,
    groundColor : C64.lightred,
    obeliskColor : C64.black,
    firstEnemy : Enemy.TYPE_SAUCER_BLUE,
    enemyCount : 6,
    spawnTable : [
      Enemy.TYPE_MISSILE,
      Enemy.TYPE_SAUCER_BLUE,
    ]
  }
];

Level.init = function()
{
  Level.reset();
};

Level.nextLevel = function()
{
  Level.number += 1;
  Level.current = Level.data[Level.number - 1];
};

Level.reset = function()
{
  Level.number = 1;
  Level.current = Level.data[Level.number - 1];
};