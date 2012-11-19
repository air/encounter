// Ricochet2D.java

package air.sim.geom;

import air.sim.object.SimObject;
import air.sim.object.MobileSimObject;
import air.util.Maths;

/**
 * Ricochet2D performs elastic collisions between simple shapes.
 * @author Aaron Bell
 */
 
//** To Do: separateCircles() not separating circles fully, float rounding?

//** Problem: SimObject is moved in separateCircles: corresponding
//** BoundingCircle IS NOT!
//** similar prob. with immobile objects: directly changing loc is unacceptable

//** Problem: separateCircles rounding errors lead to post-move intersect of
//** -tiny number
//** don't force floats until absolutely necessary!


public abstract class Ricochet2D
{
  //** enable debugging mode */
  public static boolean DEBUG = false;

 
  /**
   * Move circle-bounded SimObjects to their approximate point of collision.
   * @param s1 first object.
   * @param s2 second object.
   */

  public static final void separateCircles(SimObject s1, SimObject s2)
  {
    float intersectDist = Geometry2D.circlesDist(s1.location, s1.boundingRadius(),
                                                 s2.location, s2.boundingRadius());
    if (intersectDist >= 0 && DEBUG)
    {
      System.out.println("Ricochet2D: no separation needed:");
      System.out.println("obj1.distance(obj2) = "
        + s1.location.distance(s2.location));
      System.out.println("centres: "+s1.location+", "+s2.location);
      System.out.print("radii: s1 = "+s1.boundingRadius());
      System.out.println(", s2 = "+s2.boundingRadius());
      System.out.println("circlesDist(s1,s2) = "+intersectDist);
    }
    
    if (DEBUG) System.out.println("Ricochet: intersect before sep: "
      + intersectDist);

    float moveDist = (intersectDist / -2);
    if (DEBUG) System.out.println("Ricochet: moveDist: "+moveDist);
    
    // now moveDist is the positive distance each circle must move, directly
    // away from one another.
    
    float centresDist = (float)s1.location.distance(s2.location);
    
    // ratio of small triangle to big one
    float scale = moveDist / centresDist;
    
    float s1MoveX = (s2.location.x - s1.location.x) * -scale;
    float s1MoveY = (s2.location.y - s1.location.y) * -scale;
    
    float s2MoveX = (s1.location.x - s2.location.x) * -scale;
    float s2MoveY = (s1.location.y - s2.location.y) * -scale;
    /*
    System.out.println("intersectDist: "+intersectDist);
    System.out.println("moveDist     : "+moveDist);
    System.out.println("centresDist  : "+centresDist);
    System.out.println("scale        : "+scale);
    System.out.println("s1 moveX     : "+s1MoveX);
    System.out.println("s1 moveY     : "+s1MoveY);
    System.out.println("s2 moveX     : "+s2MoveX);
    System.out.println("s2 moveY     : "+s2MoveY);
    */
    s1.location.x += s1MoveX;
    ((BoundingCircle)s1.bound()).centre.x += s1MoveX;
    s1.location.y += s1MoveY;
    ((BoundingCircle)s1.bound()).centre.y += s1MoveY;
    
    s2.location.x += s2MoveX;
    ((BoundingCircle)s2.bound()).centre.x += s2MoveX;
    s2.location.y += s2MoveY;
    ((BoundingCircle)s2.bound()).centre.y += s2MoveY;

    intersectDist = Geometry2D.circlesDist(s1.location, s1.boundingRadius(),
                                           s2.location, s2.boundingRadius());
    if (DEBUG) System.out.println("Ricochet: intersect after sep: "
      + intersectDist);
  }
  

  /**
   * Ricochet circles apart in an elastic collision.
   * @param obj first object.
   * @param otherObj second object.
   */

  public static final void circles(SimObject simObj1, SimObject simObj2)
  {
    MobileSimObject obj1 = (MobileSimObject)simObj1;
    MobileSimObject obj2 = (MobileSimObject)simObj2;
    transferMomentum(obj1, obj2);
    transferMomentum(obj2, obj1);
  }
  

  public static final void transferMomentum(MobileSimObject obj1,
                                            MobileSimObject obj2)
  {    
    // using doubles here for max accuracy
    
    double dx = obj2.location.x - obj1.location.x;
    double dy = obj2.location.y - obj1.location.y;
      
    double angleToOther = Math.toDegrees(Math.atan2(dy, dx)) + 90;
    double angleVelocity = Math.toDegrees(
      Math.atan2(obj1.velocity.y, obj1.velocity.x)
    ) + 90;
    
    double collideAngle = (angleVelocity - angleToOther);
    // mod into easier range
    if (collideAngle < 0) collideAngle += 360;
    if (DEBUG) System.out.println("Angle of collision: "+ collideAngle);
    
    // only transfer if collision angle is -90 -> 90
    if (collideAngle < 90 || collideAngle > 270)
    {
      // portion of the velocity to apply to other object
      double velTransfer = Math.cos(Math.toRadians(collideAngle));
      if (DEBUG) System.out.println("Velocity transfer: "+velTransfer);
      
      double pushForce = obj1.scalarVelocity() * velTransfer;
      if (DEBUG) System.out.println("Push force: "+pushForce);
    
      short pushBearing = (short)Maths.mod((int)Math.round(angleToOther), 360);
      if (DEBUG) System.out.println("Push angle: "+pushBearing);
      
      double pushX = pushForce * Math.sin(Math.toRadians(pushBearing));
      double pushY = pushForce * Math.cos(Math.toRadians(pushBearing));

      // the transfer
      obj2.velocity.x += (pushX / 2);
      obj2.velocity.y -= (pushY / 2);
      // the opposite force, newton's 3rd law
      obj1.velocity.x += (-pushX / 2);
      obj1.velocity.y -= (-pushY / 2);
      
    }
  }
}