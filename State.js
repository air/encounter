var State = {};

State.ATTRACT = 'attract';
State.WAIT_FOR_ENEMY = 'waitForEnemy';
State.COMBAT = 'combat';
State.WAIT_FOR_PORTAL = 'waitForPortal';
State.WARP = 'warp';
State.GAME_OVER = 'gameOver';

State.current = null;

State.worldNumber = null;
State.enemiesRemaining = null;

State.init = function()
{
  State.current = State.ATTRACT;
  State.setupAttract();
}

State.setupAttract = function()
{
  Overlay.update();
}

State.setupWaitForEnemy = function()
{
  State.worldNumber = 1;
  State.enemiesRemaining = 6;
}

State.enemyKilled = function()
{
  State.enemiesRemaining -= 1;
  Overlay.update();
}