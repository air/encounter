import { log, error, panic } from '/js/UTIL.js';
import * as State from '/js/State.js'
import * as MY3 from '/js/MY3.js'
import * as Encounter from '/js/Encounter.js'
import * as Level from '/js/Level.js'
import * as UTIL from '/js/UTIL.js'

export var current = null; // reference to current enemy object, whatever that is
export var isAlive = false;
export var isFirstOnLevel = null; // is this the first enemy on the level? If so the type is not random

var spawnTimerStartedAt = null;

export const TYPE_SAUCER_SINGLE = 'saucerSingle';
export const TYPE_SAUCER_TRIPLE = 'saucerTriple';
export const TYPE_SAUCER_CHAINGUN = 'saucerChaingun';
export const TYPE_SAUCER_SHOTGUN = 'saucerShotgun';
export const TYPE_SAUCER_AUTOSHOTGUN = 'saucerAutoShotgun';
export const TYPE_MISSILE = 'missile';

export function reset()
{
  isFirstOnLevel = true;
};

export function startSpawnTimer()
{
  log('started enemy spawn timer');
  spawnTimerStartedAt = MY3.clock.oldTime;
};

export function spawnIfReady()
{
  if ((MY3.clock.oldTime - spawnTimerStartedAt) > Encounter.TIME_TO_SPAWN_ENEMY_MS)
  {
    spawn();
    State.setupCombat();
  }
};

export function spawn()
{
  var type = null;

  if (isFirstOnLevel)
  {
    type = Level.current.firstEnemy;
    isFirstOnLevel = false;
    log('using first enemy for level ' + Level.number + ': ' + type);
  }
  else
  {
    type = UTIL.randomFromArray(Level.current.spawnTable);
    log('spawn table generated enemy: ' + type);
  }

  if (type === TYPE_MISSILE)
  {
    current = Missile.spawn();
    State.actors.add(current.actor);
    isAlive = true;
  }
  else
  {
    WhitePortal.spawnForEnemy(type);
  }
};

export function spawnGivenTypeAt(type, location)
{
  switch (type)
  {
    case TYPE_MISSILE:
      log('warn: missile spawned in spawnGivenTypeAt, ignoring location parameter')
      current = Missile.spawn();
      break;
    case TYPE_SAUCER_SINGLE:
      current = new SaucerSingle(location);
      break;
    case TYPE_SAUCER_TRIPLE:
      current = new SaucerTriple(location);
      break;
    case TYPE_SAUCER_CHAINGUN:
      current = new SaucerChaingun(location);
      break;
    case TYPE_SAUCER_SHOTGUN:
      current = new SaucerShotgun(location);
      break;
    case TYPE_SAUCER_AUTOSHOTGUN:
      current = new SaucerAutoShotgun(location);
      break;
    default:
      panic('unknown enemy type: ' + type);
  }

  State.actors.add(current.actor);
  isAlive = true;
  Indicators.setYellow(true);
};

// enemy is hit and destroyed, but the explosion still has to play out
export function destroyed()
{
  Sound.playerKilled();
  isAlive = false;

  State.actors.remove(current.actor);

  // if this enemy has a destroyed() decorator, invoke it
  if (typeof(current.destroyed) === 'function')
  {
    current.destroyed.call();
  }

  Explode.at(current.mesh.position);
};

// explosion has finished animating
export function cleared()
{
  State.enemyKilled();
};
