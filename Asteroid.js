var Asteroid = {};

Asteroid.RADIUS = 40;
Asteroid.GEOMETRY = new THREE.SphereGeometry(Shot.RADIUS, 16, 16);
//Asteroid.MATERIAL = MATS.normal;

Asteroid.newInstance = function()
{
  return new THREE.Mesh(Asteroid.GEOMETRY, Asteroid.MATERIAL);
}

Asteroid.collideWithPlayer = function(position)
{
  if (physics.doCirclesCollide(position, Asteroid.RADIUS, Player.position, Player.RADIUS))
  {
    Player.wasHit();
  }
}