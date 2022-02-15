import { log, error, panic } from '/js/UTIL.js';
import * as Grid from '/js/Grid.js'

var Radar = {};

Radar.RESOLUTION_X = 200;
Radar.RESOLUTION_Z = 200;
Radar.CROSSHAIR_RADIUS = 25;
Radar.RANGE = 20000; // world units from one side of the radar to the other (i.e. the diameter)

Radar.CENTER_X = Math.floor(Radar.RESOLUTION_X / 2);
Radar.CENTER_Z = Math.floor(Radar.RESOLUTION_Z / 2);

Radar.BLIP_RADIUS = 3;
Radar.OBELISK_BLIP_RADIUS = 1;

Radar.showObelisks = false; // in Encounter, false
Radar.showShots = true; // in Encounter, false

Radar.TYPE_PLAYER = 'player';
Radar.TYPE_ENEMY = 'enemy';
Radar.TYPE_SHOT = 'shot';
Radar.TYPE_PORTAL = 'portal';
Radar.TYPE_OBELISK = 'obelisk';
Radar.TYPE_NONE = 'none';

Radar.CSS_CENTRED_DIV = 'position:fixed; bottom:10px; width:100%';
Radar.CSS_RADAR_DIV = 'opacity:1.0; margin-left:auto; margin-right:auto';

Radar.radarDiv = null; // for hide/show
Radar.canvasContext = null; // for painting on

Radar.init = function()
{
  // for centring at the bottom we need two divs, hurray!
  var centredDiv = document.createElement('div');
  centredDiv.id = 'centredRadarDiv';
  centredDiv.style.cssText = Radar.CSS_CENTRED_DIV;
  // set the z-index for all the radar divs in the parent div
  centredDiv.style.zIndex = Display.ZINDEX_RADAR;

  Radar.radarDiv = document.createElement('div');
  Radar.radarDiv.id = 'radarDiv';
  Radar.radarDiv.style.cssText = Radar.CSS_RADAR_DIV;
  Radar.radarDiv.style.width = Radar.RESOLUTION_X + 'px';
  Radar.radarDiv.style.height = Radar.RESOLUTION_Z + 'px';
  Radar.radarDiv.style.display = 'none'; // off by default until shown

  var radar = document.createElement('canvas');
  radar.width = Radar.RESOLUTION_X;
  radar.height = Radar.RESOLUTION_Z;

  Radar.radarDiv.appendChild(radar);
  centredDiv.appendChild(Radar.radarDiv);
  document.body.appendChild(centredDiv);

  Radar.canvasContext = radar.getContext('2d');
  Radar.initCanvasClipRegion();
};

Radar.initCanvasClipRegion = function()
{
  Radar.canvasContext.beginPath();
  Radar.canvasContext.moveTo(45, 0);
  Radar.canvasContext.lineTo(154, 0);
  Radar.canvasContext.lineTo(200, 45);
  Radar.canvasContext.lineTo(200, 154);
  Radar.canvasContext.lineTo(154, 200);
  Radar.canvasContext.lineTo(45, 200);
  Radar.canvasContext.lineTo(0, 154);
  Radar.canvasContext.lineTo(0, 45);
  Radar.canvasContext.closePath();
  Radar.canvasContext.clip();
};

Radar.addToScene = function()
{
  Radar.radarDiv.style.display = 'block';
};

Radar.removeFromScene = function()
{
  Radar.radarDiv.style.display = 'none';
};

Radar.blip = function(x, z, blipSize)
{
  var size = (blipSize === undefined) ? Radar.BLIP_RADIUS : blipSize;
  Radar.canvasContext.fillRect(x - size, z - size, size * 2, size * 2);
};

// This limits the radar to only showing Radar.RANGE
Radar.translatePositionByRange = function(xPos, zPos)
{
  var x = (xPos / Radar.RANGE) * Radar.RESOLUTION_X;
  var z = (zPos / Radar.RANGE) * Radar.RESOLUTION_Z;
  return new THREE.Vector2(x, z);
};

// blipSize is optional
Radar.render = function(worldx, worldz, blipSize)
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
  Radar.blip(Radar.CENTER_X + radarPos.x, Radar.CENTER_Z + radarPos.y, blipSize);
};

// Render obelisks on the radar. Not done in the original.
// Renders all obelisks in a square of size Radar.RANGE.
Radar.renderRadarObelisks = function()
{
  Radar.canvasContext.fillStyle = C64.css.darkgrey;

  // start at player position and move to bottom right of radar range
  var xStart = Player.position.x - (Radar.RANGE / 2);
  var zStart = Player.position.z - (Radar.RANGE / 2);

  // starting at that point, find the first line of obelisks that we have to render
  var firstXLine = Math.ceil(xStart / Grid.SPACING) * Grid.SPACING;
  var firstZLine = Math.ceil(zStart / Grid.SPACING) * Grid.SPACING;

  for (var x = firstXLine; x < (firstXLine + Radar.RANGE); x += Grid.SPACING)
  {
    for (var z = firstZLine; z < (firstZLine + Radar.RANGE); z += Grid.SPACING)
    {
      Radar.render(x, z, Radar.OBELISK_BLIP_RADIUS);
    }
  }
};

// Alternative render: show all obelisks in the Grid.viewport. Not currently used.
Radar.renderViewportObelisks = function()
{
  Radar.canvasContext.fillStyle = C64.css.darkgrey;

  for (var x = Grid.viewport.min.x; x <= Grid.viewport.max.x; x += Grid.SPACING)
  {
    for (var z = Grid.viewport.min.y; z <= Grid.viewport.max.y; z += Grid.SPACING)
    {
      Radar.render(x, z, Radar.OBELISK_BLIP_RADIUS);
    }
  }
};

Radar.clearCanvas = function()
{
  Radar.canvasContext.fillStyle = C64.css.black;
  Radar.canvasContext.fillRect(0, 0, Radar.RESOLUTION_X, Radar.RESOLUTION_Z);

  // crosshairs
  Radar.canvasContext.strokeStyle = C64.css.grey;
  Radar.canvasContext.lineWidth = 4;
  Radar.canvasContext.moveTo(Radar.CENTER_X, Radar.CENTER_Z - Radar.CROSSHAIR_RADIUS);
  Radar.canvasContext.lineTo(Radar.CENTER_X, Radar.CENTER_Z + Radar.CROSSHAIR_RADIUS)
  Radar.canvasContext.moveTo(Radar.CENTER_X - Radar.CROSSHAIR_RADIUS, Radar.CENTER_Z);
  Radar.canvasContext.lineTo(Radar.CENTER_X + Radar.CROSSHAIR_RADIUS, Radar.CENTER_Z);
  Radar.canvasContext.stroke();
};

Radar.update = function()
{
  Radar.clearCanvas();

  // obelisks go underneath more important blips
  if (Radar.showObelisks)
  {
    Radar.renderRadarObelisks();
  }

  // render all actors as blips
  for (var i = 0; i < State.actors.list.length; i++)
  {
    // set the colour by actor type
    var type = State.actors.list[i].radarType;

    switch (type)
    {
      case Radar.TYPE_ENEMY:
        Radar.canvasContext.fillStyle = C64.css.yellow;
        Radar.render(State.actors.list[i].getObject3D().position.x, State.actors.list[i].getObject3D().position.z);
        break;
      case Radar.TYPE_SHOT:
        if (Radar.showShots)
        {
          Radar.canvasContext.fillStyle = C64.css.orange;
          Radar.render(State.actors.list[i].getObject3D().position.x, State.actors.list[i].getObject3D().position.z);
        }
        break;
      case Radar.TYPE_PORTAL:
        Radar.canvasContext.fillStyle = C64.randomCssColour();
        Radar.render(State.actors.list[i].getObject3D().position.x, State.actors.list[i].getObject3D().position.z);
        break;
      case Radar.TYPE_NONE:
        // no op
        break;
      default:
        panic('unknown .radarType ' + type + ' for actor ' + State.actors.list[i]);
    }
  }
};
