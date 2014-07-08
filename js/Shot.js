'use strict';

// Player or enemy shot

var Shot = {};

Shot.RADIUS = 40;
Shot.OFFSET_FROM_SHOOTER = 120; // created this far in front of you
Shot.CAN_TRAVEL = 16000; // TODO confirm
Shot.GEOMETRY = new THREE.SphereGeometry(Shot.RADIUS, 16, 16);

Shot.TYPE_PLAYER = 'playerShot';
Shot.TYPE_ENEMY = 'enemyShot';

// returns a new shot fired by the shooterObject.
// material is required.
// alternatingMaterial is optional for shots that flip material per frame.
// TODO would be cool to delegate material behaviour to a Material type rather than assuming here
Shot.newInstance = function(shooterObject, shooterPosition, shooterRotation, material, alternatingMaterial)
{
  var newShot = new THREE.Mesh(Shot.GEOMETRY, material);
  if (shooterObject === Player)
  {
    newShot.shotType = Shot.TYPE_PLAYER;
  }
  else
  {
    newShot.shotType = Shot.TYPE_ENEMY;
  }

  if (typeof alternatingMaterial !== 'undefined')
  {
    newShot.originalMaterial = material;
    newShot.alternatingMaterial = alternatingMaterial;
  }

  newShot.radarType = Radar.TYPE_SHOT;

  newShot.position.copy(shooterPosition);
  newShot.rotation.copy(shooterRotation);
  newShot.translateZ(-Shot.OFFSET_FROM_SHOOTER);

  newShot.hasTravelled = 0;
  // for debug only
  newShot.closeObeliskIndex = new THREE.Vector2(0,0); // not actually true at init time

  newShot.update = function(timeDeltaMillis) {
    // update alternating materials
    if (typeof this.alternatingMaterial !== 'undefined')
    {
      this.material = (this.material === this.originalMaterial ? this.alternatingMaterial : this.originalMaterial);
    }
    // move the shot
    var actualMoveSpeed = timeDeltaMillis * Encounter.SHOT_SPEED;
    this.translateZ(-actualMoveSpeed);
    this.hasTravelled += actualMoveSpeed;

    // expire an aging shot based on distance travelled
    if (this.hasTravelled > Shot.CAN_TRAVEL)
    {
      Shot.cleanUpDeadShot(this);
    }
    else
    {
      Shot.collideWithObelisks(this);
      Shot.collideWithShips(this);
    }
  };

  return newShot;
}

Shot.collideWithObelisks = function(shot)
{
  // if an obelisk is close (fast check), do a detailed collision check
  if (Physics.isCloseToAnObelisk(shot.position, Shot.RADIUS))
  {
    // check for precise collision
    var obelisk = Physics.getCollidingObelisk(shot.position, Shot.RADIUS);
    // if we get a return value we have work to do
    if (typeof obelisk !== "undefined")
    {
      // we have a collision, bounce
      Physics.bounceObjectOutOfIntersectingCircle(obelisk.position, Obelisk.RADIUS, shot, Shot.RADIUS);
      Sound.shotBounce();
    }
  }

  // draw some informational lines if we're in debug mode
  if (Physics.debug)
  {
    // always need to know the closest for drawing the debug line
    shot.closeObeliskIndex = Physics.getClosestObelisk(shot.position);

    // kill old line and add a new one
    scene.remove(shot.line);
    scene.remove(shot.pointer);

    // get the obelisk object itself to read its position
    var obelisk = Grid.rows[shot.closeObeliskIndex.y][shot.closeObeliskIndex.x];
    shot.line = new MY3.Line(shot.position, obelisk.position);
    
    shot.pointer = new MY3.Pointer(shot.position, MY3.objectRotationAsUnitVector(shot), 200);
    scene.add(shot.line);
    scene.add(shot.pointer);
  }
}

Shot.collideWithShips = function(shot)
{
  // kill the player
  if (MY3.doCirclesCollide(shot.position, Shot.RADIUS, Player.position, Player.RADIUS))
  {
    Player.wasHit();
  }
  // kill the enemy
  if (Enemy.isAlive && MY3.doCirclesCollide(shot.position, Shot.RADIUS, Enemy.current.position, Enemy.current.RADIUS))
  {
    Enemy.destroyed();
    // remove the shot
    Shot.cleanUpDeadShot(shot);
  }
}

Shot.cleanUpDeadShot = function(shot)
{
  // clean up debug lines
  if (Physics.debug)
  {
    scene.remove(shot.line);
    scene.remove(shot.pointer);
  }

  if (shot.shooter === Player)
  {
    Player.shotsInFlight -= 1;
  }
  else // check if this was the last enemy shot cleaned up
  {
    var allEnemyShotsGone = true;
    for (var actor in State.actors)
    {
      log(actor['shotType']);
      if (actor['shotType'] === Shot.TYPE_ENEMY)
      {
        allEnemyShotsGone = false;
      }
    }

    if (allEnemyShotsGone)
    {
      Indicators.setBlue(false);
    }
  }


 State.actorIsDead(shot);
}
