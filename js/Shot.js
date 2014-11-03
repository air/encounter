'use strict';

// Player or enemy shot

var Shot = {};

Shot.RADIUS = 40;
Shot.OFFSET_FROM_SHOOTER = 120; // created this far in front of you
Shot.CAN_TRAVEL = 16000; // TODO confirm
Shot.GEOMETRY = new THREE.SphereGeometry(Shot.RADIUS, 16, 16);

Shot.TYPE_PLAYER = 'playerShot';
Shot.TYPE_ENEMY = 'enemyShot';

Shot.FLICKER_FRAMES = 3;  // when flickering, show each colour for this many frames

// returns a new shot fired by the shooterObject.
// material is required.
// alternatingMaterial is optional for shots that flip material per frame.
// TODO would be cool to delegate material behaviour to a Material type rather than assuming here
Shot.newInstance = function(shooterObject, shooterPosition, shooterRotation, material, alternatingMaterial)
{
  var newShot = new THREE.Mesh(Shot.GEOMETRY, material);

  newShot.shotType = (shooterObject === Player ? Shot.TYPE_PLAYER : Shot.TYPE_ENEMY);

  // set up a flickering shot
  if (typeof alternatingMaterial !== 'undefined')
  {
    newShot.originalMaterial = material;
    newShot.alternatingMaterial = alternatingMaterial;
    newShot.frameCounter = null; // current flicker timer
    newShot.isFirstMaterial = true;  // current flicker state
  }

  newShot.radarType = Radar.TYPE_SHOT;

  newShot.position.copy(shooterPosition);
  newShot.rotation.copy(shooterRotation);
  newShot.translateZ(-Shot.OFFSET_FROM_SHOOTER);

  newShot.hasTravelled = 0;

  // update is a closure passed over to Actor and invoked there, so we need 'self' to track the owning object
  var self = newShot;
  var update = function(timeDeltaMillis) {
    // update alternating materials
    if (typeof self.alternatingMaterial !== 'undefined')
    {
      self.material = (self.isFirstMaterial ? self.originalMaterial : self.alternatingMaterial);
      self.frameCounter += 1;
      if (self.frameCounter === Shot.FLICKER_FRAMES)
      {
        self.isFirstMaterial = !self.isFirstMaterial;
        self.frameCounter = 0;
      }
    }

    // move the shot
    var actualMoveSpeed = timeDeltaMillis * Encounter.SHOT_SPEED;
    self.translateZ(-actualMoveSpeed);
    self.hasTravelled += actualMoveSpeed;

    // expire an aging shot based on distance travelled
    if (self.hasTravelled > Shot.CAN_TRAVEL)
    {
      Shot.cleanUpDeadShot(self);
    }
    else
    {
      Shot.collideWithObelisks(self);
      Shot.collideWithShips(self);
    }
  };

  newShot.actor = new Actor(newShot, update, newShot.radarType);

  return newShot;
};

Shot.collideWithObelisks = function(shot)
{
  // if an obelisk is close (fast check), do a detailed collision check
  if (Physics.isCloseToAnObelisk(shot.position, Shot.RADIUS))
  {
    // check for precise collision
    var collidePosition = Physics.isCollidingWithObelisk(shot.position, Shot.RADIUS);
    // if we get a return value we have work to do
    if (typeof collidePosition !== 'undefined')
    {
      // we have a collision, bounce
      Physics.bounceObjectOutOfIntersectingCircle(collidePosition, Obelisk.RADIUS, shot, Shot.RADIUS);
      Sound.shotBounce();
    }
  }
};

Shot.collideWithShips = function(shot)
{
  // kill the player
  if (shot.shotType === Shot.TYPE_ENEMY && MY3.doCirclesCollide(shot.position, Shot.RADIUS, Player.position, Player.RADIUS))
  {
    Player.wasHit();
    State.setupPlayerHitInCombat();
  }
  // kill the enemy
  if (shot.shotType === Shot.TYPE_PLAYER && Enemy.isAlive && MY3.doCirclesCollide(shot.position, Shot.RADIUS, Enemy.current.mesh.position, Enemy.current.RADIUS))
  {
    Enemy.destroyed();
    // remove the shot
    Shot.cleanUpDeadShot(shot);
  }
};

// FIXME use instanceof Shot here for sanity
// for use with Array.every() where the Array contains Actor objects
Shot.isNotEnemyShot = function(element, index, array)
{
  if (element.getObject3D().shotType === Shot.TYPE_ENEMY)
  {
    return false;
  }
  else // it's a Player shot or shotType is undefined
  {
    return true;
  }
};

Shot.cleanUpDeadShot = function(shot)
{
  State.actors.remove(shot.actor);

  if (shot.shotType === Shot.TYPE_PLAYER)
  {
    Player.shotsInFlight -= 1;
  }
  else // if this was the last enemy shot cleaned up, no enemy shots remain so kill the blue light
  {
    if (State.actors.list.every(Shot.isNotEnemyShot))
    {
      Indicators.setBlue(false);
    }
  }
};
