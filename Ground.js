var Ground = new THREE.Mesh(); // initially a default mesh, we'll define this in init()

// ground plane. Lots of segments will KILL your fps
Ground.X_SEGMENTS = 16;
Ground.Z_SEGMENTS = 16;
Ground.GEOMETRY = new THREE.PlaneGeometry(Grid.MAX_X, Grid.MAX_Z, Ground.X_SEGMENTS, Ground.Z_SEGMENTS);

// TODO Ground.MATERIAL = new THREE.MeshLambertMaterial({ color : C64.palette.green });
Ground.MATERIAL = MATS.normal;

Ground.init = function()
{
  // actually set up this Mesh using our materials
  THREE.Mesh.call(Ground, Ground.GEOMETRY, Ground.MATERIAL); 
  
  // plane inits as a wall on X axis facing the positive Z space, turn away to make a floor
  Ground.rotation.x = -90 * TO_RADIANS;

  // plane is anchored at its centre
  Ground.position.x = Grid.MAX_X / 2;
  Ground.position.z = Grid.MAX_Z / 2;

  // zero Y is ground
  Ground.position.y = 0;
  Ground.receiveShadow = true;

  scene.add(Ground);
  console.info('ground plane placed');
}