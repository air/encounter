import { log, error, panic, random } from '/js/UTIL.js';
import * as Ground from '/js/Ground.js';
import * as Physics from '/js/Physics.js';
import * as Player from '/js/Player.js';
import * as MY3 from '/js/MY3.js';
import * as Obelisk from '/js/Obelisk.js';
import * as Encounter from '/js/Encounter.js';

import { BufferGeometryUtils } from '/lib/BufferGeometryUtils.js';
import * as THREE from '/lib/three.module.js'

// the Grid is:
// - sized depending on camera.far (set in Encounter.js, see Encounter.DRAW_DISTANCE)
// - a single mesh of NxN obelisks
// - always a square, big enough to contain a circle of radius camera.far
// - parent to the Ground plane
// - a 2D viewport of fixed size looking down on an infinite grid, snapped to Grid.SPACING

export const SPACING = 1000;
// need camera draw distance before we can calculate these:
export var SIZE_SQUARE = null;  // how big the viewport is
export var OBELISKS_PER_SIDE = null;
export var TRIGGER_DISTANCE_FROM_VIEWPORT_EDGE = null; // get this close to the viewport edge and we move the grid

// state
export var viewport = null; // use a THREE.Box2D as our viewport
export var geometry = null; // we're going to merge all objects into a single Geometry
export var mesh = null;

// the grid is not active during warp
export var isActive = true;

export function init()
{
  calculateConstants();

  viewport = new THREE.Box2(new THREE.Vector2(0,0), new THREE.Vector2(SIZE_SQUARE, SIZE_SQUARE));

  geometry = new THREE.BufferGeometry();
  var obeliskMesh = Obelisk.newMeshInstance(); // just need one of these as a cookie cutter

  // one-time loop to set up geometry
  for (var rowIndex = 0; rowIndex < OBELISKS_PER_SIDE; rowIndex++)
  {
    for (var colIndex = 0; colIndex < OBELISKS_PER_SIDE; colIndex++)
    {
      var xPos = colIndex * SPACING;
      var zPos = rowIndex * SPACING;
      // update the template mesh and merge it into Grid
      obeliskMesh.position.set(new THREE.Vector3(xPos, Obelisk.HEIGHT / 2, zPos));
      geometry = BufferGeometryUtils.mergeBufferGeometries([geometry, obeliskMesh.geometry]);
    }
  }

mesh = new THREE.Mesh(geometry, Obelisk.MATERIAL);

  // the final bit of setup for parent/child is delegated to Ground.init(), some unlovely coupling
};

function calculateConstants()
{
  // 1. Size the grid.
  // see how many SPACING intervals we need to cover 2x the draw distance, round that up, and multiply back to absolute size
  SIZE_SQUARE = Math.ceil((camera.far * 2) / SPACING) * SPACING;
  log('draw distance is ' + camera.far + ' so the grid viewport is a square of side ' + SIZE_SQUARE);

  // 2. How many obelisks on a side?
  OBELISKS_PER_SIDE = (SIZE_SQUARE / SPACING) + 1;

  // 3. How close to the edge do we trigger a grid move?
  var midPoint = SIZE_SQUARE / 2;
  if ((OBELISKS_PER_SIDE % 2) === 0)
  {
    // For even-sized grids the midpoint will always be between two lines.
    // Trigger on the first line between the midpoint and the edge
    TRIGGER_DISTANCE_FROM_VIEWPORT_EDGE = midPoint - (SPACING / 2);
  }
  else
  {
    // For odd-sized grids, the midpoint will be directly on a line of obelisks.
    // Trigger on the next lines over on either side.
    TRIGGER_DISTANCE_FROM_VIEWPORT_EDGE = midPoint - SPACING;
  }
  log('trigger distance from viewport edge is ' + TRIGGER_DISTANCE_FROM_VIEWPORT_EDGE);
};

// also takes care of Ground plane
function addToScene()
{
  MY3.scene.add(mesh); // includes a child Ground object if Ground.DO_RENDER
  if (!Ground.DO_RENDER)
  {
    Display.groundDiv.style.display = 'block';
  }

  isActive = true;
};

// also takes care of Ground plane
function removeFromScene()
{
  MY3.scene.remove(mesh); // includes a child Ground object if Ground.DO_RENDER
  if (!Ground.DO_RENDER)
  {
    Display.groundDiv.style.display = 'none';
  }

  isActive = false;
};

// start in the viewport centre or offset to avoid a collision if OBELISKS_PER_SIDE is even
function playerStartLocation()
{
  var position = new THREE.Vector3(SIZE_SQUARE / 2, Encounter.CAMERA_HEIGHT, SIZE_SQUARE / 2);
  if (Physics.isCloseToAnObelisk(position, Player.RADIUS))
  {
    position.x += SPACING / 2;
    position.z += SPACING / 2;
  }
  return position;
};

// returns a Vector3 with X,Z *somewhere in the viewport* and Y=0
function randomLocation()
{
  var x = UTIL.random(viewport.min.x, viewport.max.x);
  var z = UTIL.random(viewport.min.y, viewport.max.y);
  return new THREE.Vector3(x, 0, z);
};

// returns a Vector3.
// requires a max distance. Optionally can specify a minimum distance
// FIXME brute force alert!
function randomLocationCloseToPlayer(maxDistance, minDistance)
{
  var location = null;
  do
  {
    location = randomLocationCloseToPoint(Player.position, maxDistance);
  } while (location.distanceTo(Player.position) < minDistance);
  return location;
};

// point: Vector3
// returns a Vector3
// FIXME brute force alert!
function randomLocationCloseToPoint(point, maxDistance)
{
  if (point.x === undefined)
  {
    panic('point must have an x:', point);
  }

  var location = null;
  do
  {
    location = randomLocation();
  } while (point.distanceTo(location) > maxDistance);
  return location;
};

// reset the position of the viewport, and use the correct colours for this level
reset = function()
{
  viewport.set(new THREE.Vector2(0,0), new THREE.Vector2(SIZE_SQUARE, SIZE_SQUARE));
  mesh.position.x = viewport.min.x;
  mesh.position.z = viewport.min.y; // note that Y in the Vector2 represents Z

  mesh.material.color = new THREE.Color(Level.current.obeliskColor);
  Ground.setColor(Level.current.groundColor);
};

// When the player moves close to the edge of the grid, translate it seamlessly.
// Child objects (Ground plane) will inherit translations.
// Reminder, the Grid.mesh is anchored at its bottom left (0,0) in X,Z terms.
function update()
{
  // define a threshold that will trigger when the player crosses it
  // TODO could use another bounding box with contains() to make this tidier
  var maxThresholdX = viewport.max.x - TRIGGER_DISTANCE_FROM_VIEWPORT_EDGE;
  var maxThresholdZ = viewport.max.y - TRIGGER_DISTANCE_FROM_VIEWPORT_EDGE;
  var minThresholdX = viewport.min.x + TRIGGER_DISTANCE_FROM_VIEWPORT_EDGE;
  var minThresholdZ = viewport.min.y + TRIGGER_DISTANCE_FROM_VIEWPORT_EDGE;

  if (Player.position.x > maxThresholdX)
  {
    viewport.translate(new THREE.Vector2(SPACING, 0));
  }
  else if (Player.position.x < minThresholdX)
  {
    viewport.translate(new THREE.Vector2(-SPACING, 0));
  }

  if (Player.position.z > maxThresholdZ)
  {
    viewport.translate(new THREE.Vector2(0, SPACING));
  }
  else if (Player.position.z < minThresholdZ)
  {
    viewport.translate(new THREE.Vector2(0, -SPACING));
  }

  // move the mesh to match the viewport
  mesh.position.x = viewport.min.x;
  mesh.position.z = viewport.min.y; // note that Y in the Vector2 represents Z
};
