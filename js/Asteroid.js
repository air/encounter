'use strict';

var Asteroid = {};

Asteroid.RADIUS = 60;
Asteroid.GEOMETRY = new THREE.SphereGeometry(Asteroid.RADIUS, 16, 16);
Asteroid.BASE_MATERIAL = new THREE.MeshBasicMaterial({ color : C64.white });

Asteroid.newInstance = function()
{
  var material = Asteroid.BASE_MATERIAL.clone();
  material.color = new THREE.Color(Asteroid.generateColor());
  var newAsteroid = new THREE.Mesh(Asteroid.GEOMETRY, material);
  return newAsteroid;
};

// anything but black
Asteroid.generateColor = function()
{
  var color = C64.black;
  while (color === C64.black)
  {
    color = UTIL.randomFromArray(C64.palette);
  }
  return color;
};

Asteroid.collideWithPlayer = function(asteroidPosition)
{
  if (MY3.doCirclesCollide(asteroidPosition, Asteroid.RADIUS, Player.position, Player.RADIUS))
  {
    log('player hit asteroid in warp');
    Player.wasHit();
    Warp.state = Warp.STATE_PLAYER_HIT;
  }
};