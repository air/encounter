"use strict";

var Radar = {};

Radar.RESOLUTION_X = 200;
Radar.RESOLUTION_Z = 200;
Radar.RANGE = 20000;

Radar.CENTER_X = Math.floor(Radar.RESOLUTION_X / 2);
Radar.CENTER_Z = Math.floor(Radar.RESOLUTION_Z / 2);

Radar.BLIP_RADIUS = 3;

Radar.radarDiv = null; // for hide/show
Radar.canvasContext = null; // for painting on

Radar.TYPE_PLAYER = 'player';
Radar.TYPE_ENEMY = 'enemy';
Radar.TYPE_SHOT = 'shot';
Radar.TYPE_PORTAL = 'portal';

var CSS_CENTRED_DIV = 'position:fixed; bottom:0px; width:100%';
var CSS_RADAR_DIV = 'background-color:#000; opacity:0.6; margin-left:auto; margin-right:auto';

Radar.init = function()
{
  // for centring at the bottom we need two divs, hurray!
  var centredDiv = document.createElement('div');
  centredDiv.id = 'centredRadarDiv';
  centredDiv.style.cssText = CSS_CENTRED_DIV;

  Radar.radarDiv = document.createElement('div');
  Radar.radarDiv.id = 'radarDiv';
  Radar.radarDiv.style.cssText = CSS_RADAR_DIV;
  Radar.radarDiv.style.width = Radar.RESOLUTION_X + 'px';
  Radar.radarDiv.style.height = Radar.RESOLUTION_Z + 'px';

  var radar = document.createElement('canvas');
  radar.width = Radar.RESOLUTION_X;
  radar.height = Radar.RESOLUTION_Z;

  Radar.radarDiv.appendChild(radar);
  centredDiv.appendChild(Radar.radarDiv);
  document.body.appendChild(centredDiv);

  Radar.canvasContext = radar.getContext('2d');
}

Radar.addToScene = function()
{
  Radar.radarDiv.style.display = 'block';
}

Radar.removeFromScene = function()
{
  Radar.radarDiv.style.display = 'none';
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
  Radar.canvasContext.fillStyle = "#00FF33";
  Radar.render(Player.position.x, Player.position.z);

  // render all actors as blips
  for (var i = 0; i < State.actors.length; i++)
  {
    // set the colour by actor type
    var type = State.actors[i].radarType;
    /*
    switch (type)
    {
      Radar.TYPE_ENEMY:
        Radar.canvasContext.fillStyle = "#FF0000";
        break;
      Radar.TYPE_PLAYER:
        Radar.canvasContext.fillStyle = "#FFFFFF";
        break;
      Radar.TYPE_SHOT:
        Radar.canvasContext.fillStyle = "#FFFF00";
        break;
      Radar.TYPE_PORTAL:
        Radar.canvasContext.fillStyle = C64.randomCssColour();
        break;
      default:
        error('unknown .radarType ' + type + ' for actor ' + State.actors[i]);
        Radar.canvasContext.fillStyle = "#0000FF";
    }
    */
    Radar.render(State.actors[i].position.x, State.actors[i].position.z);
  }
}
