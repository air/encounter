var Enemy = new THREE.Mesh(); // initially a default mesh, we'll define this in init()

Enemy.RADIUS = 40;
Enemy.GEOMETRY = new THREE.SphereGeometry(Enemy.RADIUS, 8, 4);
Enemy.MATERIAL = MATS.wireframe.clone();

// state
Enemy.lastTimeFired = 0;
Enemy.shotsInFlight = 0;
Enemy.isAlive = true;

Enemy.init = function()
{
  // actually set up this Mesh using our materials
  THREE.Mesh.call(Enemy, Enemy.GEOMETRY, Enemy.MATERIAL); 
  scene.add(Enemy);
  actors.push(Enemy);
}

Enemy.update = function()
{
  // if an obelisk is close (fast check), do a detailed collision check
  if (physics.isCloseToAnObelisk(Enemy.position, Enemy.RADIUS))
  {
    // check for precise collision
    var obelisk = physics.getCollidingObelisk(Enemy.position, Enemy.RADIUS);
    // if we get a return there is work to do
    if (typeof obelisk !== "undefined") {
      // we have a collision, move the Enemy out but don't change the rotation
      physics.moveCircleOutOfStaticCircle(obelisk.position, Obelisk.RADIUS, Enemy.position, Enemy.RADIUS);
      sound.PlayerCollideObelisk();
    }
  }
}