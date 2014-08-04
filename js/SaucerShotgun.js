'use strict';

// A green saucer that fires a shotgun blast of 3 shots

var SaucerShotgun = Object.create(Saucer);

SaucerShotgun.MATERIAL = new THREE.MeshBasicMaterial({ color: C64.lightgreen });
SaucerShotgun.SHOT_MATERIAL = new THREE.MeshBasicMaterial({ color: C64.lightgreen });

SaucerShotgun.SHOT_SPREAD = 0.04;

// override
SaucerShotgun.performsShotWindup = false;

SaucerShotgun.init = function()
{
  // actually set up this Mesh using our materials
  THREE.Mesh.call(SaucerShotgun, Saucer.GEOMETRY, SaucerShotgun.MATERIAL);
  SaucerShotgun.scale.y = Saucer.MESH_SCALE_Y;
};

SaucerShotgun.shoot = function()
{
  Sound.enemyShoot();

  // shot 1 directly at player
  MY3.rotateObjectToLookAt(SaucerShotgun, Player.position);
  var shotMiddle = Shot.newInstance(SaucerShotgun, SaucerShotgun.position, SaucerShotgun.rotation, SaucerShotgun.SHOT_MATERIAL);
  // shot 2 to the right of target
  SaucerShotgun.rotation.y -= SaucerShotgun.SHOT_SPREAD;
  var shotRight = Shot.newInstance(SaucerShotgun, SaucerShotgun.position, SaucerShotgun.rotation, SaucerShotgun.SHOT_MATERIAL);
  // shot 3 to the left
  SaucerShotgun.rotation.y += (SaucerShotgun.SHOT_SPREAD * 2);
  var shotLeft = Shot.newInstance(SaucerShotgun, SaucerShotgun.position, SaucerShotgun.rotation, SaucerShotgun.SHOT_MATERIAL);

  State.actors.push(shotMiddle);
  State.actors.push(shotRight);
  State.actors.push(shotLeft);
  scene.add(shotMiddle);
  scene.add(shotRight);
  scene.add(shotLeft);
};