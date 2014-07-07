'use strict';

// Used by Enemy.js.

var BlueSaucer = Saucer.newInstance();

BlueSaucer.RADIUS = Saucer.RADIUS; // need a copy for Shot.collideWithShips
BlueSaucer.MATERIAL1 = new THREE.MeshBasicMaterial({ color: C64.cyan });
BlueSaucer.MATERIAL2 = new THREE.MeshBasicMaterial({ color: C64.lightgrey });
BlueSaucer.SHOT_MATERIAL1 = new THREE.MeshBasicMaterial({ color: C64.cyan });
BlueSaucer.SHOT_MATERIAL2 = new THREE.MeshBasicMaterial({ color: C64.lightgrey });

BlueSaucer.init = function()
{
  // actually set up this Mesh using our materials
  THREE.Mesh.call(BlueSaucer, Saucer.GEOMETRY, BlueSaucer.MATERIAL);
  BlueSaucer.scale.y = Saucer.MESH_SCALE_Y;
}

BlueSaucer.shoot = function()
{
  Sound.enemyShoot();
  var shot = Shot.newInstance(BlueSaucer, BlueSaucer.position, BlueSaucer.rotation, BlueSaucer.SHOT_MATERIAL1, BlueSaucer.SHOT_MATERIAL2);
  State.actors.push(shot);
  scene.add(shot);
}

// override Saucer
BlueSaucer.update = function(timeDeltaMillis)
{
  BlueSaucer.material = (BlueSaucer.material === BlueSaucer.MATERIAL1 ? BlueSaucer.MATERIAL2 : BlueSaucer.MATERIAL1);

  switch(this.state)
  {
    case Saucer.STATE_WAITING:
      BlueSaucer.updateWaiting(timeDeltaMillis);
      break;
    case Saucer.STATE_MOVING:
      BlueSaucer.updateMoving(timeDeltaMillis);
      break;
    default:
      error('unknown Saucer state: ' + this.state);
  } 
}
