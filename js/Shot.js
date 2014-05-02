"use strict";

// Player or enemy shot

var Shot = {};

Shot.RADIUS = 40;
Shot.OFFSET_FROM_SHOOTER = 120; // created this far in front of you
Shot.CAN_TRAVEL = 16000; // TODO confirm
Shot.GEOMETRY = new THREE.SphereGeometry(Shot.RADIUS, 16, 16);
Shot.MATERIAL = MATS.normal;

// returns a new shot fired by the firingObject
Shot.newInstance = function(firingObject, shooterPosition, shooterRotation)
{
  var newShot = new THREE.Mesh(Shot.GEOMETRY, Shot.MATERIAL);
  newShot.shooter = firingObject;

  newShot.radarType = Radar.TYPE_SHOT;

  newShot.position.copy(shooterPosition);
  newShot.rotation.copy(shooterRotation);
  newShot.translateZ(-Shot.OFFSET_FROM_SHOOTER);

  newShot.hasTravelled = 0;
  // for debug only
  newShot.closeObeliskIndex = new THREE.Vector2(0,0); // not actually true at init time

  newShot.update = function(timeDeltaMillis) {
    // move the shot
    var actualMoveSpeed = timeDeltaMillis * Encounter.SHOT_SPEED;
    this.translateZ(-actualMoveSpeed);
    this.hasTravelled += actualMoveSpeed;

    if (Physics.debug)
    {
      // unhighlight the old closest obelisk
      Physics.unHighlightObelisk(shot.closeObeliskIndex.x, shot.closeObeliskIndex.y);
    }

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
      
      if (Physics.debug)
      {
        Physics.highlightObelisk(shot.closeObeliskIndex.x, shot.closeObeliskIndex.y, 6);
      }
    }
    else if (Physics.debug)
    {
      // otherwise a near miss, highlight for debug purposes
      Physics.highlightObelisk(shot.closeObeliskIndex.x, shot.closeObeliskIndex.y, 2);
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
    Physics.unHighlightObelisk(shot.closeObeliskIndex.x, shot.closeObeliskIndex.y);
  }

  if (shot.shooter === Player)
  {
    Player.shotsInFlight -= 1;
  }

  State.actorIsDead(shot);
}
