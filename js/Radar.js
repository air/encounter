'use strict';

var Radar = {};

Radar.RESOLUTION_X = 200;
Radar.RESOLUTION_Z = 200;
Radar.RANGE = 20000; // world units from one side of the radar to the other (i.e. the diameter)

Radar.CENTER_X = Math.floor(Radar.RESOLUTION_X / 2);
Radar.CENTER_Z = Math.floor(Radar.RESOLUTION_Z / 2);

Radar.BLIP_RADIUS = 3;
Radar.OBELISK_BLIP_RADIUS = 1;

Radar.showObelisks = true; // in Encounter, false
Radar.showShots = true; // in Encounter, false

Radar.TYPE_PLAYER = 'player';
Radar.TYPE_ENEMY = 'enemy';
Radar.TYPE_SHOT = 'shot';
Radar.TYPE_PORTAL = 'portal';
Radar.TYPE_OBELISK = 'obelisk';

Radar.CSS_CENTRED_DIV = 'position:fixed; bottom:10px; width:100%';
Radar.CSS_RADAR_DIV = 'background-color:#000; opacity:1.0; margin-left:auto; margin-right:auto';

Radar.radarDiv = null; // for hide/show
Radar.canvasContext = null; // for painting on

Radar.init = function()
{
  // for centring at the bottom we need two divs, hurray!
  var centredDiv = document.createElement('div');
  centredDiv.id = 'centredRadarDiv';
  centredDiv.style.cssText = Radar.CSS_CENTRED_DIV;
  // set the z-index for all the radar divs in the parent div
  centredDiv.style.zIndex = Overlay.ZINDEX_RADAR;

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
  var size = (typeof blipSize === 'undefined') ? Radar.BLIP_RADIUS : blipSize;
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

// Option 1: render all obelisks in a square of size Radar.RANGE
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

// Option 2: render all obelisks in the Grid.viewport
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

Radar.update = function()
{
  Radar.canvasContext.clearRect(0, 0, Radar.RESOLUTION_X, Radar.RESOLUTION_Z);

  // obelisks go underneath more important blips
  if (Radar.showObelisks)
  {
    Radar.renderRadarObelisks();
  }

  // TODO currently Player is special-cased as they're not in State.actors
  Radar.canvasContext.fillStyle = C64.css.white;
  Radar.render(Player.position.x, Player.position.z);

  // render all actors as blips
  for (var i = 0; i < State.actors.length; i++)
  {
    // set the colour by actor type
    var type = State.actors[i].radarType;

    switch (type)
    {
      case Radar.TYPE_ENEMY:
        Radar.canvasContext.fillStyle = C64.css.yellow;
        Radar.render(State.actors[i].position.x, State.actors[i].position.z);
        break;
      case Radar.TYPE_PLAYER:
        // TODO see above, currently player is special case and this block is unused
        Radar.canvasContext.fillStyle = C64.css.white;
        Radar.render(State.actors[i].position.x, State.actors[i].position.z);
        break;
      case Radar.TYPE_SHOT:
        if (Radar.showShots)
        {
          Radar.canvasContext.fillStyle = C64.css.orange;
          Radar.render(State.actors[i].position.x, State.actors[i].position.z);
        }
        break;
      case Radar.TYPE_PORTAL:
        Radar.canvasContext.fillStyle = C64.randomCssColour();
        Radar.render(State.actors[i].position.x, State.actors[i].position.z);
        break;
      default:
        error('unknown .radarType ' + type + ' for actor ' + State.actors[i]);
    }
  }
};
