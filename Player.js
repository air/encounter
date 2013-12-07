var Player = new THREE.Mesh(); // initially a default mesh, we'll define this in init()

Player.RADIUS = 40;
Player.GEOMETRY = new THREE.SphereGeometry(Player.RADIUS, 8, 4);
Player.MATERIAL = MATS.wireframe.clone();

// state
Player.lastTimeFired = 0;
Player.shotsInFlight = 0;

Player.init = function()
{
  // actually set up this Mesh using our materials
  THREE.Mesh.call(Player, Player.GEOMETRY, Player.MATERIAL); 
  scene.add(Player);
  //actors.push(playerMesh);
}

Player.update = function()
{
  
}