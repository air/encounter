// Geometry2D.java

package air.sim.geom;

import java.awt.geom.*;

/**
 * Geometry2D provides miscellaneous geometric operations.
 *
 * @author Aaron Bell
 */

public abstract class Geometry2D
{
  private static final float max(float x, float y) {
    return ( x >= y ? x : y);
  }
  
  private static final float min(float x, float y) {
    return ( x <= y ? x : y);
  }
  
  private static final float abs(float x) {
    return ( x < 0 ? -x : x);
  }
  
  
  /**
   * @return the midpoint of the line defined by the given points.
   * @param p1 start point.
   * @param p2 end point.
   */
  
  public static final Point2D.Float
  lineMidpoint(Point2D.Float p1, Point2D.Float p2)
  {
    float x, y, dx, dy;    
    
    x = min(p1.x, p2.x) + abs( (p1.x - p2.x) / 2 );
    y = min(p1.y, p2.y) + abs( (p1.y - p2.y) / 2 );
    
    return new Point2D.Float(x, y);
  }
  
  
  /**
   * Calculate distance between circles, from closest points on their edges.
   * @param c1 the centre of the first circle.
   * @param r1 the radius of the first circle.
   * @param c2 the centre of the second circle.
   * @param r2 the radius of the second circle.
   * @return the distance. A negative value indicates intersecting circles.
   */
  
  public static final float circlesDist(Point2D.Float c1, float r1,
                                        Point2D.Float c2, float r2)
  {
    float centresDist = (float)c1.distance(c2);
    
    return (centresDist - r1 - r2);
  }
}