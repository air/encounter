var Grid = new Object();

// static constants
Grid.SIZE_X = 50;
Grid.SIZE_Z = 50;
Grid.SPACING = 1000;
// 'MAX' = the furthest extent in these directions
Grid.MAX_X = (Grid.SIZE_X - 1) * Grid.SPACING;
Grid.MAX_Z = (Grid.SIZE_Z - 1) * Grid.SPACING;

// static state
Grid.rows = []; // each row is an X line of Grid.SIZE_X Obelisks

// call once to set up
Grid.init = function()
{
  for (var rowIndex=0; rowIndex<Grid.SIZE_Z; rowIndex++) {
    var row = [];
    for (var colIndex=0; colIndex<Grid.SIZE_X; colIndex++) {
      var xpos = colIndex * Grid.SPACING;
      var zpos = rowIndex * Grid.SPACING;
      var obelisk = new THREE.Mesh(Obelisk.GEOMETRY, Obelisk.MATERIAL);
      obelisk.position.set(xpos, Obelisk.HEIGHT / 2, zpos);
      row.push(obelisk);
      scene.add(obelisk);
    }
    Grid.rows[rowIndex] = row;
  }
  console.info('obelisks placed')
}