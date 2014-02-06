var Radar = {};

Radar.RESOLUTION_X = 200;
Radar.RESOLUTION_Z = 200;
Radar.RANGE = 20000;

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

// TODO try THREE.Math.mapLinear?
// This will scale the radar to show the entire Grid.
Radar.translatePosition = function(worldx, worldz)
{
  var x = (worldx / Grid.MAX_X) * Radar.RESOLUTION_X;
  var z = (worldz / Grid.MAX_Z) * Radar.RESOLUTION_Z;
  return new THREE.Vector2(x, z);
}

// This limits the radar to only showing Radar.RANGE.
Radar.translatePositionByRange = function(xPos, zPos)
{
  var x = (xPos / Radar.RANGE) * Radar.RESOLUTION_X;
  var z = (zPos / Radar.RANGE) * Radar.RESOLUTION_Z;
  return new THREE.Vector2(x, z);
}

Radar.render = function(worldx, worldz)
{
  // translate so player is at origin
  var xRelativeToPlayer = worldx - Player.position.x;
  var zRelativeToPlayer = worldz - Player.position.z;

  // rotate, http://en.wikipedia.org/wiki/Rotation_(mathematics)#Matrix_algebra
  var x = (xRelativeToPlayer * Math.cos(Player.rotation.y)) - (zRelativeToPlayer * Math.sin(Player.rotation.y));
  var z = (xRelativeToPlayer * Math.sin(Player.rotation.y)) + (zRelativeToPlayer * Math.cos(Player.rotation.y));

  // scale for radar range
  var radarPos = Radar.translatePositionByRange(x, z);

  // paint relative to center (player)
  Radar.blip(Radar.CENTER_X + radarPos.x, Radar.CENTER_Z + radarPos.y);
}

Radar.update = function()
{
  Radar.canvasContext.clearRect(0, 0, Radar.RESOLUTION_X, Radar.RESOLUTION_Z);
  Radar.canvasContext.fillStyle = "#FFFFFF";
  Radar.render(Player.position.x, Player.position.z);

  for (var i = 0; i < actors.length; i++)
  {
    if (actors[i].isAlive)
    {
      Radar.canvasContext.fillStyle = "#FF0000";
    }
    else
    {
      Radar.canvasContext.fillStyle = "#666666";
    }
    Radar.render(actors[i].position.x, actors[i].position.z);
  }
}
