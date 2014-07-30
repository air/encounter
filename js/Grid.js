'use strict';

var Grid = {};

// the Grid is:
// - sized depending on camera.far (set in Encounter.js, see Encounter.DRAW_DISTANCE)
// - a single mesh of NxN obelisks
// - always a square, big enough to contain a circle of radius camera.far
// - parent to the Ground plane
// - a viewport of fixed size on an infinite grid, snapped to Grid.SPACING

Grid.SPACING = 1000;
Grid.SIZE_SQUARE = null;        // need camera draw distance before we can calculate this
Grid.OBELISKS_PER_SIDE = null;  // need camera draw distance before we can calculate this

// state
Grid.viewport = null;
Grid.geometry = null; // we're going to merge all objects into a single Geometry
Grid.mesh = null;

// the grid is not active during warp
Grid.isActive = true;

Grid.init = function()
{
  Grid.SIZE_SQUARE = 18000;        // need camera draw distance before we can calculate this
  Grid.OBELISKS_PER_SIDE = 19;  // need camera draw distance before we can calculate this

  // see how many intervals we need to cover 2x draw distance, round that up, multiply back to absolute size
  // Grid.SIZE_SQUARE = Math.ceil((camera.far * 2) / Grid.SPACING) * Grid.SPACING;
  log('draw distance is ' + camera.far + ' so the grid viewport is a square of side ' + Grid.SIZE_SQUARE);

  // Grid.OBELISKS_PER_SIDE = (Grid.SIZE_SQUARE / Grid.SPACING) + 1;

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
  Grid.viewport.set(new THREE.Vector2(0,0), new THREE.Vector2(Grid.SIZE_SQUARE, Grid.SIZE_SQUARE));
  Grid.mesh.position.x = Grid.viewport.min.x;
  Grid.mesh.position.z = Grid.viewport.min.y; // note that Y in the Vector2 represents Z
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