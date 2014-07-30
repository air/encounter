'use strict';

var Grid = {};

Grid.SIZE_X = 4;
Grid.SIZE_Z = 4;
Grid.SPACING = 1000;
// 'MAX' = the furthest extent in these directions
Grid.MAX_X = (Grid.SIZE_X - 1) * Grid.SPACING;
Grid.MAX_Z = (Grid.SIZE_Z - 1) * Grid.SPACING;

// state
Grid.rows = []; // each row is an X line of Grid.SIZE_X Obelisks
Grid.geometry = null; // we're going to merge all objects into a single Geometry
Grid.mesh = null;

// the grid is not active during warp
Grid.isActive = true;

Grid.init = function()
{
  Grid.geometry = new THREE.Geometry();
  var obeliskMesh = Obelisk.newMeshInstance(); // just need one of these as a cookie cutter

  // one-time loop to create objects
  for (var rowIndex = 0; rowIndex < Grid.SIZE_Z; rowIndex++)
  {
    var row = [];
    for (var colIndex = 0; colIndex < Grid.SIZE_X; colIndex++)
    {
      var xpos = colIndex * Grid.SPACING;
      var zpos = rowIndex * Grid.SPACING;
      var obelisk = Obelisk.newInstance();
      obelisk.position.set(xpos, Obelisk.HEIGHT / 2, zpos);
      row.push(obelisk);

      // update the template mesh and merge it into Grid
      obeliskMesh.position.copy(obelisk.position);
      THREE.GeometryUtils.merge(Grid.geometry, obeliskMesh);
    }
    Grid.rows[rowIndex] = row;
  }

  Grid.mesh = new THREE.Mesh(Grid.geometry, Obelisk.MATERIAL);

  Grid.addToScene();
};

Grid.addToScene = function()
{
  scene.add(Grid.mesh);
  Grid.isActive = true;
};

Grid.removeFromScene = function()
{
  scene.remove(Grid.mesh);
  Grid.isActive = false;
};

// returns a Vector3
Grid.randomLocation = function()
{
  return new THREE.Vector3(UTIL.random(0, Grid.MAX_X), 0, UTIL.random(0, Grid.MAX_Z));
};

// returns a Vector3
Grid.randomLocationCloseToPlayer = function(maxDistance)
{
  return Grid.randomLocationCloseToPoint(Player.position, maxDistance);
};

// point: Vector3
// returns a Vector3
// FIXME brute force alert!
Grid.randomLocationCloseToPoint = function(point, maxDistance)
{
  if (typeof point.x === "undefined") throw('point must have an x, wrong type?');

  var location = null;
  do
  {
    location = Grid.randomLocation();
  } while (point.distanceTo(location) > maxDistance);
  return location;
};

// when the player moves close to the edge of the grid, translate it seamlessly.
// reminder, the Grid.mesh has a .position which is bottom left (0,0) in X,Z terms. 
Grid.update = function()
{
  // TODO rework MAX_X? What does it mean now?
  var furthestGridExtentX = Grid.mesh.position.x + ((Grid.SIZE_X - 1) * Grid.SPACING);
  var furthestGridExtentZ = Grid.mesh.position.z + ((Grid.SIZE_Z - 1) * Grid.SPACING);
  // define a threshold that will trigger when the player crosses it
  var maxThresholdX = furthestGridExtentX - Grid.SPACING;
  var maxThresholdZ = furthestGridExtentZ - Grid.SPACING;
  var minThresholdX = Grid.mesh.position.x + Grid.SPACING;
  var minThresholdZ = Grid.mesh.position.z + Grid.SPACING;

  if (Player.position.x > maxThresholdX)
  {
    Grid.mesh.translateX(Grid.SPACING);
  }
  else if (Player.position.x < minThresholdX)
  {
    Grid.mesh.translateX(-Grid.SPACING);
  }

  if (Player.position.z > maxThresholdZ)
  {
    Grid.mesh.translateZ(Grid.SPACING);
  }
  else if (Player.position.z < minThresholdZ)
  {
    Grid.mesh.translateZ(-Grid.SPACING);
  }
};