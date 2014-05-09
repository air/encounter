'use strict';

// Top-level class for Enemy-related stuff.

var Enemy = {};

Enemy.current = null; // reference to current enemy object, whatever that is
Enemy.isAlive = false;

Enemy.spawnTimerStartedAt = null;

Enemy.TYPE_SAUCER = 'saucer';
Enemy.TYPE_MISSILE = 'missile';
Enemy.SPAWN_TABLE = [
  Enemy.TYPE_MISSILE,
  Enemy.TYPE_MISSILE,
  Enemy.TYPE_SAUCER,
  Enemy.TYPE_SAUCER,
  Enemy.TYPE_SAUCER
];

Enemy.init = function()
{
  // no op
}

Enemy.startSpawnTimer = function()
{
  log('started enemy spawn timer');
  Enemy.spawnTimerStartedAt = clock.oldTime;
}

Enemy.spawnIfReady = function()
{
  if ((clock.oldTime - Enemy.spawnTimerStartedAt) > Encounter.TIME_TO_SPAWN_ENEMY_MS)
  {
    Enemy.spawn();
    State.setupCombat();
  }
}

Enemy.spawn = function()
{
  var diceRoll = UTIL.random(1, Enemy.SPAWN_TABLE.length) - 1; // adjust to be array index
  log('dice roll ' + diceRoll + ' gives enemy: ' + Enemy.SPAWN_TABLE[diceRoll]);
  if (Enemy.SPAWN_TABLE[diceRoll] === Enemy.TYPE_SAUCER)
  {
    Enemy.current = Saucer.spawn();
  }
  else if (Enemy.SPAWN_TABLE[diceRoll] === Enemy.TYPE_MISSILE)
  {
    Enemy.current = Missile.spawn();
  }
  else
  {
    error ('unknown enemy type: ' + Enemy.SPAWN_TABLE[diceRoll]);
  }

  scene.add(Enemy.current);
  State.actors.push(Enemy.current);
  Enemy.isAlive = true;
}

Enemy.destroyed = function()
{
  Sound.playerKilled();
  scene.remove(Enemy.current);
  Enemy.isAlive = false;

  State.actorIsDead(Enemy.current);
  State.enemyKilled();

  // if this enemy has a destroyed() decorator, invoke it
  if (typeof(Enemy.current.destroyed) === 'function')
  {
    Enemy.current.destroyed.call(); 
  }
}