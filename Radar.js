var Radar = {};

Radar.RESOLUTION_X = 200;
Radar.RESOLUTION_Z = 200;

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
  radar.style.width = Radar.RESOLUTION_X + 'px';
  radar.style.height = Radar.RESOLUTION_Z + 'px';

  radarDiv.appendChild(radar);
  centredDiv.appendChild(radarDiv);
  document.body.appendChild(centredDiv);

  Radar.canvasContext = radar.getContext('2d');
}

Radar.update = function()
{
  Radar.canvasContext.fillStyle = "#FF0000";
  Radar.canvasContext.fillRect(0,0,150,75);
}