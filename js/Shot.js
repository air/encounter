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

  newShot.update = function(timeDeltaMillis) {
    // update alternating materials
    if (typeof this.alternatingMaterial !== 'undefined')
    {
      this.material = (this.isFirstMaterial ? this.originalMaterial : this.alternatingMaterial);
      this.frameCounter += 1;
      if (this.frameCounter === Shot.FLICKER_FRAMES)
      {
        this.isFirstMaterial = !this.isFirstMaterial;
        this.frameCounter = 0;
      }
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
  }
  // kill the enemy
  if (shot.shotType === Shot.TYPE_PLAYER && Enemy.isAlive && MY3.doCirclesCollide(shot.position, Shot.RADIUS, Enemy.current.position, Enemy.current.RADIUS))
  {
    Enemy.destroyed();
    // remove the shot
    Shot.cleanUpDeadShot(shot);
  }
};

// for use with Array.every()
Shot.isNotEnemyShot = function(element, index, array)
{
  return element.shotType !== Shot.TYPE_ENEMY;
};

Shot.cleanUpDeadShot = function(shot)
{
  State.actorIsDead(shot);

  if (shot.shotType === Shot.TYPE_PLAYER)
  {
    Player.shotsInFlight -= 1;
  }
  else // check if this was the last enemy shot cleaned up
  {
    if (State.actors.every(Shot.isNotEnemyShot))
    {
      Indicators.setBlue(false);
    }
  }
};
