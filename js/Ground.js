'use strict';

var Ground = new THREE.Mesh(); // initially a default mesh, we'll define this in init()

// ground plane. Lots of segments will KILL your fps
Ground.X_SEGMENTS = 1;
Ground.Z_SEGMENTS = 1;
Ground.GEOMETRY = new THREE.PlaneGeometry(Grid.SIDE_X, Grid.SIDE_Z, Ground.X_SEGMENTS, Ground.Z_SEGMENTS);

Ground.MATERIAL = new THREE.MeshBasicMaterial({ color : C64.green });

Ground.init = function()
{
  // actually set up this Mesh using our materials
  THREE.Mesh.call(Ground, Ground.GEOMETRY, Ground.MATERIAL); 
  
  // plane inits as a wall on X axis facing the positive Z space, turn away to make a floor
  Ground.rotation.x = -90 * UTIL.TO_RADIANS;

  // plane is anchored at its centre
  Ground.position.x = Grid.SIDE_X / 2;
  Ground.position.z = Grid.SIDE_Z / 2;

  // zero Y is ground
  Ground.position.y = 0;

  // we do NOT add the Ground to the scene; it's a child Object3D of the Grid, which will manage translations.
};
