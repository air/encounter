var Asteroid = {};

Asteroid.RADIUS = 60;
Asteroid.GEOMETRY = new THREE.SphereGeometry(Asteroid.RADIUS, 16, 16);
// leave material undefined to get random colours
//Asteroid.MATERIAL = MATS.normal;

Asteroid.newInstance = function()
{
  var newAsteroid = new THREE.Mesh(Asteroid.GEOMETRY, Asteroid.MATERIAL);
  return newAsteroid;
}

Asteroid.collideWithPlayer = function(asteroidPosition)
{
  if (physics.doCirclesCollide(asteroidPosition, Asteroid.RADIUS, Player.position, Player.RADIUS))
  {
    Player.wasHit();
  }
}