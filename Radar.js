var Radar = {};

Radar.RESOLUTION_X = 200;
Radar.RESOLUTION_Z = 200;

Radar.CENTER_X = Math.floor(Radar.RESOLUTION_X / 2);
Radar.CENTER_Z = Math.floor(Radar.RESOLUTION_Z / 2);

Radar.BLIP_RADIUS = 3;

Radar.canvasContext = null;

var DIV = 'div';
var CANVAS = 'canvas';

Radar.init = function()
{
  // for centring at the bottom we need two divs, hurray!
  var centredDiv = document.createElement(DIV);
  centredDiv.id = 'centredRadarDiv';
  centredDiv.style.cssText = 'position:fixed; bottom:0px; width:100%';

  var radarDiv = document.createElement(DIV);
  radarDiv.id = 'radarDiv';
  radarDiv.style.cssText = 'background-color:#000; opacity:0.6; margin-left:auto; margin-right:auto';
  radarDiv.style.width = Radar.RESOLUTION_X + 'px';
  radarDiv.style.height = Radar.RESOLUTION_Z + 'px';

  var radar = document.createElement(CANVAS);
  radar.width = Radar.RESOLUTION_X;
  radar.height = Radar.RESOLUTION_Z;

  radarDiv.appendChild(radar);
  centredDiv.appendChild(radarDiv);
  document.body.appendChild(centredDiv);

  Radar.canvasContext = radar.getContext('2d');
}

Radar.blip = function(x, z)
{
  Radar.canvasContext.fillRect(x - Radar.BLIP_RADIUS, z - Radar.BLIP_RADIUS, Radar.BLIP_RADIUS * 2, Radar.BLIP_RADIUS * 2);  
}

Radar.translatePosition = function(worldx, worldz)
{
  var x = (worldx / Grid.MAX_X) * Radar.RESOLUTION_X;
  var z = (worldz / Grid.MAX_Z) * Radar.RESOLUTION_Z;
  return new THREE.Vector2(x, z);
}

Radar.update = function()
{
  Radar.canvasContext.clearRect(0, 0, Radar.RESOLUTION_X, Radar.RESOLUTION_Z);

  // player
  Radar.canvasContext.fillStyle = "#FFFFFF";
  //Radar.blip(Radar.CENTER_X, Radar.CENTER_Z);
  var playerPosition = Radar.translatePosition(Player.position.x, Player.position.z);
  Radar.blip(playerPosition.x, playerPosition.y);

  // shots
  Radar.canvasContext.fillStyle = "#666666";
  for (var i = 0; i < actors.length; i++)
  {
    var actorPosition = Radar.translatePosition(actors[i].position.x, actors[i].position.z);
    Radar.blip(actorPosition.x, actorPosition.y);
  }

  // enemy
  if (Enemy.isAlive)
  {
    Radar.canvasContext.fillStyle = "#FF0000";
    var enemyPosition = Radar.translatePosition(Enemy.position.x, Enemy.position.z);
    Radar.blip(enemyPosition.x, enemyPosition.y);
  }
}
