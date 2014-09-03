'use strict';

var Ground = new THREE.Mesh(); // initially a default mesh, we'll define this in init()

// ground plane. Lots of segments will KILL your fps
Ground.X_SEGMENTS = 1;
Ground.Z_SEGMENTS = 1;
Ground.GEOMETRY = null; // can't create until we know the Grid size, which is based on draw distance

// default to white in order to test that color is loaded from Level data
Ground.MATERIAL = new THREE.MeshBasicMaterial({ color : C64.white });

Ground.init = function()
{
  Ground.GEOMETRY = new THREE.PlaneGeometry(Grid.SIZE_SQUARE, Grid.SIZE_SQUARE, Ground.X_SEGMENTS, Ground.Z_SEGMENTS);

  // actually set up this Mesh using our materials
  THREE.Mesh.call(Ground, Ground.GEOMETRY, Ground.MATERIAL); 
  
  // plane inits as a wall on X axis facing the positive Z space, turn away to make a floor
  Ground.rotation.x = -90 * UTIL.TO_RADIANS;

  // plane is anchored at its centre
  Ground.position.x = Grid.SIZE_SQUARE / 2;
  Ground.position.z = Grid.SIZE_SQUARE / 2;

  // zero Y is ground
  Ground.position.y = 0;

  // Ground is a child Object3D of the Grid. All movement and on/off are handled in the Grid API.
  Grid.mesh.add(Ground);
  Grid.addToScene();
};

// e.g. C64.white
Ground.setColor = function(color)
{
  Ground.material.color = new THREE.Color(color);
};