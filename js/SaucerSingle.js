'use strict';

// The first enemy, a yellow saucer firing one shot with windup sound.

var SaucerSingle = Object.create(Saucer);

SaucerSingle.MATERIAL = new THREE.MeshBasicMaterial({ color: C64.yellow });
SaucerSingle.SHOT_MATERIAL = new THREE.MeshBasicMaterial({ color: C64.yellow });

SaucerSingle.init = function()
{
  // actually set up this Mesh using our materials
  THREE.Mesh.call(SaucerSingle, Saucer.GEOMETRY, SaucerSingle.MATERIAL);
  SaucerSingle.scale.y = Saucer.MESH_SCALE_Y;
};

SaucerSingle.shoot = function()
{
  MY3.rotateObjectToLookAt(this, Player.position);
  Sound.enemyShoot();
  var shot = Shot.newInstance(SaucerSingle, SaucerSingle.position, SaucerSingle.rotation, SaucerSingle.SHOT_MATERIAL);
  State.actors.push(shot);
  scene.add(shot);
};