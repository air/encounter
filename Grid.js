
// define this so we can define some constants on it
function Grid() {};

// static constants
// FIXME make caps
Grid.sizeX = 50;
Grid.sizeZ = 50;
Grid.spacing = 1000;

Grid.MAX_X = (Grid.sizeX - 1) * Grid.spacing; // FIXME rename
Grid.MAX_Z = (Grid.sizeZ - 1) * Grid.spacing; // FIXME rename

// static state. Should probably be singleton instance state
Grid.rows = []; // each row is an X line of Grid.sizeX obelisks FIXME rework

// static init method
Grid.init = function()
{
  for (var rowIndex=0; rowIndex<Grid.sizeZ; rowIndex++) {
    var row = [];
    for (var colIndex=0; colIndex<Grid.sizeX; colIndex++) {
      var xpos = colIndex * Grid.spacing;
      var zpos = rowIndex * Grid.spacing;
      var obelisk = new THREE.Mesh(Obelisk.geometry, Obelisk.material);
      obelisk.position.set(xpos, Obelisk.height / 2, zpos);
      row.push(obelisk);
      scene.add(obelisk);
    }
    Grid.rows[rowIndex] = row;
  }
  console.info('obelisks placed')
}