'use strict';

// Lightgrey saucer firing 3 consecutive shotgun blasts with no warning.

var SaucerAutoShotgun = Object.create(Saucer);

SaucerAutoShotgun.MATERIAL = new THREE.MeshBasicMaterial({ color: C64.lightgrey });
SaucerAutoShotgun.SHOT_MATERIAL = new THREE.MeshBasicMaterial({ color: C64.lightgrey });

SaucerAutoShotgun.SHOT_SPREAD = 0.04;

// override
SaucerAutoShotgun.performsShotWindup = false;
// override
SaucerAutoShotgun.SHOTS_TO_FIRE = 3;
// override
SaucerAutoShotgun.SHOT_INTERVAL_MS = 500;

SaucerAutoShotgun.init = function()
{
  // actually set up this Mesh using our materials
  THREE.Mesh.call(SaucerAutoShotgun, Saucer.GEOMETRY, SaucerAutoShotgun.MATERIAL);
  SaucerAutoShotgun.scale.y = Saucer.MESH_SCALE_Y;
};

SaucerAutoShotgun.shoot = function()
{
  Sound.enemyShoot();
  
  // shot 1 directly at player
  MY3.rotateObjectToLookAt(SaucerAutoShotgun, Player.position);
  var shotMiddle = Shot.newInstance(SaucerAutoShotgun, SaucerAutoShotgun.position, SaucerAutoShotgun.rotation, SaucerAutoShotgun.SHOT_MATERIAL);
  // shot 2 to the right of target
  SaucerAutoShotgun.rotation.y -= SaucerAutoShotgun.SHOT_SPREAD;
  var shotRight = Shot.newInstance(SaucerAutoShotgun, SaucerAutoShotgun.position, SaucerAutoShotgun.rotation, SaucerAutoShotgun.SHOT_MATERIAL);
  // shot 3 to the left
  SaucerAutoShotgun.rotation.y += (SaucerAutoShotgun.SHOT_SPREAD * 2);
  var shotLeft = Shot.newInstance(SaucerAutoShotgun, SaucerAutoShotgun.position, SaucerAutoShotgun.rotation, SaucerAutoShotgun.SHOT_MATERIAL);

  State.actors.push(shotMiddle);
  State.actors.push(shotRight);
  State.actors.push(shotLeft);
  scene.add(shotMiddle);
  scene.add(shotRight);
  scene.add(shotLeft);
};