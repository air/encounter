'use strict';

var Grid = {};

// the Grid is:
// - a single mesh of NxN obelisks
// - parent to the Ground plane
// - a viewport of fixed size on an infinite grid, snapped to Grid.SPACING

Grid.SIZE_X = 4;
Grid.SIZE_Z = 4;
Grid.SPACING = 1000;
Grid.SIDE_X = (Grid.SIZE_X - 1) * Grid.SPACING;
Grid.SIDE_Z = (Grid.SIZE_Z - 1) * Grid.SPACING;

// state
Grid.viewport = null;
Grid.geometry = null; // we're going to merge all objects into a single Geometry
Grid.mesh = null;

// the grid is not active during warp
Grid.isActive = true;

Grid.init = function()
{
  Grid.viewport = new THREE.Box2(new THREE.Vector2(0,0), new THREE.Vector2(Grid.SIDE_X, Grid.SIDE_Z));

  Grid.geometry = new THREE.Geometry();
  var obeliskMesh = Obelisk.newMeshInstance(); // just need one of these as a cookie cutter

  // one-time loop to set up geometry
  for (var rowIndex = 0; rowIndex < Grid.SIZE_Z; rowIndex++)
  {
    for (var colIndex = 0; colIndex < Grid.SIZE_X; colIndex++)
    {
      var xPos = colIndex * Grid.SPACING;
      var zPos = rowIndex * Grid.SPACING;
      // update the template mesh and merge it into Grid
      obeliskMesh.position = new THREE.Vector3(xPos, Obelisk.HEIGHT / 2, zPos);
      THREE.GeometryUtils.merge(Grid.geometry, obeliskMesh);
    }
  }

  Grid.mesh = new THREE.Mesh(Grid.geometry, Obelisk.MATERIAL);

  // attach the Ground to the Grid as a child; translations will be inherited
  Grid.mesh.add(Ground);

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

// returns a Vector3 with X,Z *somewhere in the viewport* and Y=0
Grid.randomLocation = function()
{
  var x = UTIL.random(Grid.viewport.min.x, Grid.viewport.max.x);
  var z = UTIL.random(Grid.viewport.min.y, Grid.viewport.max.y);
  return new THREE.Vector3(x, 0, z);
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

Grid.reset = function()
{
  // TODO
};

// When the player moves close to the edge of the grid, translate it seamlessly.
// Child objects (Ground plane) will inherit translations.
// Reminder, the Grid.mesh is anchored at its bottom left (0,0) in X,Z terms. 
Grid.update = function()
{
  // define a threshold that will trigger when the player crosses it
  var maxThresholdX = Grid.viewport.max.x - Grid.SPACING;
  var maxThresholdZ = Grid.viewport.max.y - Grid.SPACING;   // note that Y in the Vector2 represents Z
  var minThresholdX = Grid.viewport.min.x + Grid.SPACING;
  var minThresholdZ = Grid.viewport.min.y + Grid.SPACING;   // note that Y in the Vector2 represents Z

  if (Player.position.x > maxThresholdX)
  {
    Grid.viewport.translate(new THREE.Vector2(Grid.SPACING, 0));
  }
  else if (Player.position.x < minThresholdX)
  {
    Grid.viewport.translate(new THREE.Vector2(-Grid.SPACING, 0));
  }
  // move the mesh to match the viewport
  Grid.mesh.position.x = Grid.viewport.min.x;

  if (Player.position.z > maxThresholdZ)
  {
    Grid.viewport.translate(new THREE.Vector2(0, Grid.SPACING));
  }
  else if (Player.position.z < minThresholdZ)
  {
    Grid.viewport.translate(new THREE.Vector2(0, -Grid.SPACING));
  }
  // move the mesh to match the viewport
  Grid.mesh.position.z = Grid.viewport.min.y; // note that Y in the Vector2 represents Z
};