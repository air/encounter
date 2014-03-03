var Grid = new Object();

Grid.SIZE_X = 40;
Grid.SIZE_Z = 40;
Grid.SPACING = 1000;
// 'MAX' = the furthest extent in these directions
Grid.MAX_X = (Grid.SIZE_X - 1) * Grid.SPACING;
Grid.MAX_Z = (Grid.SIZE_Z - 1) * Grid.SPACING;

// state
Grid.rows = []; // each row is an X line of Grid.SIZE_X Obelisks

Grid.init = function()
{
  for (var rowIndex=0; rowIndex<Grid.SIZE_Z; rowIndex++) {
    var row = [];
    for (var colIndex=0; colIndex<Grid.SIZE_X; colIndex++) {
      var xpos = colIndex * Grid.SPACING;
      var zpos = rowIndex * Grid.SPACING;
      var obelisk = Obelisk.newInstance();
      obelisk.position.set(xpos, Obelisk.HEIGHT / 2, zpos);
      row.push(obelisk);
      scene.add(obelisk);
    }
    Grid.rows[rowIndex] = row;
  }
}

// returns a Vector3
Grid.randomLocation = function()
{
  return new THREE.Vector3(random(0, Grid.MAX_X), 0, random(0, Grid.MAX_Z));
}

// returns a Vector3
Grid.randomLocationCloseToPlayer = function(maxDistance)
{
  return Grid.randomLocationCloseToPoint(Player.position, maxDistance);
}

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
}
