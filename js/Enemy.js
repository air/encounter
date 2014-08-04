'use strict';

// Top-level class for Enemy-related stuff.

var Enemy = {};

Enemy.current = null; // reference to current enemy object, whatever that is
Enemy.isAlive = false;
Enemy.isFirstOnLevel = null; // is this the first enemy on the level? If so it's not random

Enemy.spawnTimerStartedAt = null;

Enemy.TYPE_SAUCER_SINGLE = 'saucerSingle';
Enemy.TYPE_SAUCER_TRIPLE = 'saucerTriple';
Enemy.TYPE_SAUCER_CHAINGUN = 'saucerChaingun';
Enemy.TYPE_MISSILE = 'missile';

Enemy.reset = function()
{
  Enemy.isFirstOnLevel = true;
};

Enemy.startSpawnTimer = function()
{
  log('started enemy spawn timer');
  Enemy.spawnTimerStartedAt = clock.oldTime;
};

Enemy.spawnIfReady = function()
{
  if ((clock.oldTime - Enemy.spawnTimerStartedAt) > Encounter.TIME_TO_SPAWN_ENEMY_MS)
  {
    Enemy.spawn();
    State.setupCombat();
  }
};

Enemy.spawn = function()
{
  var type = null;

  if (Enemy.isFirstOnLevel)
  {
    type = Level.current.firstEnemy;
    Enemy.isFirstOnLevel = false;
    log('using first enemy for level ' + Level.number + ': ' + type);
  }
  else
  {
    type = UTIL.randomFromArray(Level.current.spawnTable);
    log('spawn table generated enemy: ' + type);
  }

  switch (type)
  {
    case Enemy.TYPE_SAUCER_SINGLE:
      Enemy.current = SaucerSingle.spawn();
      break;
    case Enemy.TYPE_SAUCER_TRIPLE:
      Enemy.current = SaucerTriple.spawn();
      break;
    case Enemy.TYPE_MISSILE:
      Enemy.current = Missile.spawn();
      break;
    case Enemy.TYPE_SAUCER_CHAINGUN:
      Enemy.current = SaucerChaingun.spawn();
      break;
    default:
      error ('unknown enemy type: ' + type);
  }

  scene.add(Enemy.current);
  State.actors.push(Enemy.current);
  Enemy.isAlive = true;
};

// enemy is hit and destroyed, but the explosion still has to play out
Enemy.destroyed = function()
{
  Sound.playerKilled();
  scene.remove(Enemy.current);
  Enemy.isAlive = false;

  State.actorIsDead(Enemy.current);

  // if this enemy has a destroyed() decorator, invoke it
  if (typeof(Enemy.current.destroyed) === 'function')
  {
    Enemy.current.destroyed.call(); 
  }

  Explode.at(Enemy.current.position);
};

// explosion has finished animating
Enemy.cleared = function()
{
  State.enemyKilled();
};