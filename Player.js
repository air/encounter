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
  // if an obelisk is close (fast check), do a detailed collision check
  if (physics.isCloseToAnObelisk(Player.position, Player.RADIUS))
  {
    // check for precise collision
    var obelisk = physics.getCollidingObelisk(Player.position, Player.RADIUS);
    // if we get a return there is work to do
    if (typeof obelisk !== "undefined") {
      // we have a collision, move the player out but don't change the rotation
      physics.moveCircleOutOfStaticCircle(obelisk.position, Obelisk.RADIUS, Player.position, Player.RADIUS);
      sound.playerCollideObelisk();
    }
  }
}