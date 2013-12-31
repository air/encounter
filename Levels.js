var Levels = {};

//Levels.MODE_WORLD = 'world';
//Levels.MODE_WARP = 'warp';
//Levels.mode = null;

Levels.worldNumber = null;
Levels.enemiesRemaining = null;

Levels.init = function()
{
  //Levels.mode = Levels.MODE_WORLD;
  Levels.worldNumber = 1;
  Levels.enemiesRemaining = 6;
  Overlay.update();
}

Levels.enemyKilled = function()
{
  Levels.enemiesRemaining -= 1;
  Overlay.update();
}