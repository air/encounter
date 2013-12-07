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
/*
Player.update = function()
{
  // if an obelisk is close (fast check), do a detailed collision check
  if (physics.isCloseToAnObelisk(this.position, Shot.RADIUS)) {
    // check for precise collision
    var obelisk = physics.getCollidingObelisk(this.position, Shot.RADIUS);
    if (typeof obelisk !== "undefined") {
      // we have a collision, bounce
      physics.bounceObjectOutOfIntersectingCircle(obelisk.position, Obelisk.RADIUS, this);
      sound.shotBounce();
      if (physics.debug)
      {
        physics.highlightObelisk(this.closeObeliskIndex.x, this.closeObeliskIndex.y, 6);
      }
    } else {
      // otherwise a near miss, highlight for debug purposes
      if (physics.debug)
      {
        physics.highlightObelisk(this.closeObeliskIndex.x, this.closeObeliskIndex.y, 2);
      }
    }
  }
}
*/
