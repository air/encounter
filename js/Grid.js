'use strict';

var Grid = {};

// the Grid is:
// - sized depending on camera.far (set in Encounter.js, see Encounter.DRAW_DISTANCE)
// - a single mesh of NxN obelisks
// - always a square, big enough to contain a circle of radius camera.far
// - parent to the Ground plane
// - a 2D viewport of fixed size looking down on an infinite grid, snapped to Grid.SPACING

Grid.SPACING = 1000;
// need camera draw distance before we can calculate these:
Grid.SIZE_SQUARE = null;  // how big the viewport is
Grid.OBELISKS_PER_SIDE = null;
Grid.TRIGGER_DISTANCE_FROM_VIEWPORT_EDGE = null; // get this close to the viewport edge and we move the grid

// state
Grid.viewport = null; // use a THREE.Box2D as our viewport
Grid.geometry = null; // we're going to merge all objects into a single Geometry
Grid.mesh = null;

// the grid is not active during warp
Grid.isActive = true;

Grid.init = function()
{
  Grid.calculateConstants();

  Grid.viewport = new THREE.Box2(new THREE.Vector2(0,0), new THREE.Vector2(Grid.SIZE_SQUARE, Grid.SIZE_SQUARE));

  Grid.geometry = new THREE.Geometry();
  var obeliskMesh = Obelisk.newMeshInstance(); // just need one of these as a cookie cutter

  // one-time loop to set up geometry
  for (var rowIndex = 0; rowIndex < Grid.OBELISKS_PER_SIDE; rowIndex++)
  {
    for (var colIndex = 0; colIndex < Grid.OBELISKS_PER_SIDE; colIndex++)
    {
      var xPos = colIndex * Grid.SPACING;
      var zPos = rowIndex * Grid.SPACING;
      // update the template mesh and merge it into Grid
      obeliskMesh.position = new THREE.Vector3(xPos, Obelisk.HEIGHT / 2, zPos);
      THREE.GeometryUtils.merge(Grid.geometry, obeliskMesh);
    }
  }

  Grid.mesh = new THREE.Mesh(Grid.geometry, Obelisk.MATERIAL);

  // the final bit of setup for parent/child is delegated to Ground.init(), some unlovely coupling
};

Grid.calculateConstants = function()
{
  // 1. Size the grid.
  // see how many SPACING intervals we need to cover 2x the draw distance, round that up, and multiply back to absolute size
  Grid.SIZE_SQUARE = Math.ceil((camera.far * 2) / Grid.SPACING) * Grid.SPACING;
  log('draw distance is ' + camera.far + ' so the grid viewport is a square of side ' + Grid.SIZE_SQUARE);

  // 2. How many obelisks on a side?
  Grid.OBELISKS_PER_SIDE = (Grid.SIZE_SQUARE / Grid.SPACING) + 1;

  // 3. How close to the edge do we trigger a grid move?
  var midPoint = Grid.SIZE_SQUARE / 2;
  if ((Grid.OBELISKS_PER_SIDE % 2) === 0)
  {
    // For even-sized grids the midpoint will always be between two lines.
    // Trigger on the first line between the midpoint and the edge
    Grid.TRIGGER_DISTANCE_FROM_VIEWPORT_EDGE = midPoint - (Grid.SPACING / 2);
  }
  else
  {
    // For odd-sized grids, the midpoint will be directly on a line of obelisks.
    // Trigger on the next lines over on either side.
    Grid.TRIGGER_DISTANCE_FROM_VIEWPORT_EDGE = midPoint - Grid.SPACING;
  }
  log('trigger distance from viewport edge is ' + Grid.TRIGGER_DISTANCE_FROM_VIEWPORT_EDGE);
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

// start in the viewport centre or offset to avoid a collision if OBELISKS_PER_SIDE is even
Grid.playerStartLocation = function()
{
  var position = new THREE.Vector3(Grid.SIZE_SQUARE / 2, Encounter.CAMERA_HEIGHT, Grid.SIZE_SQUARE / 2);
  if (Physics.isCloseToAnObelisk(position, Player.RADIUS))
  {
    position.x += Grid.SPACING / 2;
    position.z += Grid.SPACING / 2; 
  }
  return position;
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
  if (typeof point.x === 'undefined')
  {
    throw('point must have an x, wrong type?');
  }
  
  var location = null;
  do
  {
    location = Grid.randomLocation();
  } while (point.distanceTo(location) > maxDistance);
  return location;
};

// reset the position of the viewport, and use the correct colours for this level
Grid.reset = function()
{
  Grid.viewport.set(new THREE.Vector2(0,0), new THREE.Vector2(Grid.SIZE_SQUARE, Grid.SIZE_SQUARE));
  Grid.mesh.position.x = Grid.viewport.min.x;
  Grid.mesh.position.z = Grid.viewport.min.y; // note that Y in the Vector2 represents Z

  Grid.mesh.material.color = new THREE.Color(Level.current.obeliskColor);
  Ground.material.color = new THREE.Color(Level.current.groundColor);
};

// When the player moves close to the edge of the grid, translate it seamlessly.
// Child objects (Ground plane) will inherit translations.
// Reminder, the Grid.mesh is anchored at its bottom left (0,0) in X,Z terms. 
Grid.update = function()
{
  // define a threshold that will trigger when the player crosses it
  // TODO could use another bounding box with contains() to make this tidier 
  var maxThresholdX = Grid.viewport.max.x - Grid.TRIGGER_DISTANCE_FROM_VIEWPORT_EDGE;
  var maxThresholdZ = Grid.viewport.max.y - Grid.TRIGGER_DISTANCE_FROM_VIEWPORT_EDGE;
  var minThresholdX = Grid.viewport.min.x + Grid.TRIGGER_DISTANCE_FROM_VIEWPORT_EDGE;
  var minThresholdZ = Grid.viewport.min.y + Grid.TRIGGER_DISTANCE_FROM_VIEWPORT_EDGE;

  if (Player.position.x > maxThresholdX)
  {
    Grid.viewport.translate(new THREE.Vector2(Grid.SPACING, 0));
  }
  else if (Player.position.x < minThresholdX)
  {
    Grid.viewport.translate(new THREE.Vector2(-Grid.SPACING, 0));
  }

  if (Player.position.z > maxThresholdZ)
  {
    Grid.viewport.translate(new THREE.Vector2(0, Grid.SPACING));
  }
  else if (Player.position.z < minThresholdZ)
  {
    Grid.viewport.translate(new THREE.Vector2(0, -Grid.SPACING));
  }

  // move the mesh to match the viewport
  Grid.mesh.position.x = Grid.viewport.min.x;
  Grid.mesh.position.z = Grid.viewport.min.y; // note that Y in the Vector2 represents Z
};
