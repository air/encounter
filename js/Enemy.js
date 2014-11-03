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
Enemy.TYPE_SAUCER_SHOTGUN = 'saucerShotgun';
Enemy.TYPE_SAUCER_AUTOSHOTGUN = 'saucerAutoShotgun';
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

  if (type === Enemy.TYPE_MISSILE)
  {
    Enemy.current = Missile.spawn();
    State.actors.add(Enemy.current.actor);
    Enemy.isAlive = true;
  }
  else
  {
    WhitePortal.spawnForEnemy(type);
  }
};

Enemy.spawnGivenTypeAt = function(type, location)
{
  switch (type)
  {
    case Enemy.TYPE_SAUCER_SINGLE:
      Enemy.current = new SaucerSingle(location);
      break;
    case Enemy.TYPE_SAUCER_TRIPLE:
      Enemy.current = new SaucerTriple(location);
      break;
    case Enemy.TYPE_SAUCER_CHAINGUN:
      Enemy.current = SaucerChaingun.spawn(location);
      break;
    case Enemy.TYPE_SAUCER_SHOTGUN:
      Enemy.current = SaucerShotgun.spawn(location);
      break;
    case Enemy.TYPE_SAUCER_AUTOSHOTGUN:
      Enemy.current = SaucerAutoShotgun.spawn(location);
      break;
    default:
      panic('unknown enemy type: ' + type);
  }

  State.actors.add(Enemy.current.actor);
  Enemy.isAlive = true;
  Indicators.setYellow(true);
};

// enemy is hit and destroyed, but the explosion still has to play out
Enemy.destroyed = function()
{
  Sound.playerKilled();
  Enemy.isAlive = false;

  State.actors.remove(Enemy.current.actor);

  // if this enemy has a destroyed() decorator, invoke it
  if (typeof(Enemy.current.destroyed) === 'function')
  {
    Enemy.current.destroyed.call(); 
  }

  Explode.at(Enemy.current.mesh.position);
};

// explosion has finished animating
Enemy.cleared = function()
{
  State.enemyKilled();
};