// Intersect2D.java

package air.sim.geom;

import java.awt.geom.*;

/**
 * Intersect2D performs simple intersection tests for common 2-D shapes.
 * Note the tests are of the yes/no type, and do not provide intersect points.
 *
 * @author Aaron Bell
 */


public abstract class Intersect2D
{
  /** enable debugging mode. */
  public static boolean DEBUG = false;

  /**
   * Intersection of two lines.
   * @param l1 the first line.
   * @param l2 the second line.
   * @return true if the lines intersect.
   */
  
  public static final boolean lines(Line2D.Float l1, Line2D.Float l2)
  {
    return l1.intersectsLine(l2);
  }


  /**
   * Intersection of two circles.
   * @param centre1 first centre.
   * @param radius1 first radius.
   * @param centre2 second centre.
   * @param radius2 second radius.
   * @return true if the circles intersect.
   */
  
  public static final boolean circles(Point2D.Float centre1, float radius1,
                                      Point2D.Float centre2, float radius2)
  {
    // small constant to ensure substantial intersect, not just rounding error
    float sigma = 0.01f;

    float r1PlusR2Sq = (radius1 + radius2) * (radius1 + radius2);

    if ( centre1.distanceSq(centre2) < (r1PlusR2Sq - sigma) )
    {
      if (DEBUG)
      {
        System.out.println("Intersect:");
        System.out.println("distSq: " + centre1.distanceSq(centre2));
        System.out.println("less than (r1+r2)Sq: " + (r1PlusR2Sq - sigma));
        System.out.println("Inter pts: " + centre1 + ", " + centre2);
      }
      return true;
    }
    else {
      return false;
    }
  }
  
  
  /**
   * Intersection of a line and a circle.
   * @param line the line.
   * @param centre circle centre.
   * @param radius circle radius.
   * @return true if the line intersects the circle.
   */
  
  public static final boolean lineCircle(Line2D.Float line, Point2D.Float centre,
                                         float radius)
  {
    if (line.ptLineDist(centre) < radius) {
      return true;
    }
    else {
      return false;
    }
  }
  
  
  /**
   * Intersection of rectangles.
   * @param rect1 first rectangle.
   * @param rect2 second rectangle.
   * @return true if the rectangles intersect.
   */
  
  public static final boolean rectangles(Rectangle2D.Float rect1,
                                         Rectangle2D.Float rect2)
  {
    // get bottom-right coords. (r1x2 = rect1, x2)
    float r1x2 = rect1.x + rect1.width;
    float r1y2 = rect1.y + rect1.height;
    float r2x2 = rect2.x + rect2.width;
    float r2y2 = rect2.y + rect2.height;
    
    // if r1 is to the left of r2, or to the right of r2...
    // ...OR if r1 is above r2, or below r2, then no intersect.
    
    if ( r1x2 < rect2.x || rect1.x > r2x2 ||
         r1y2 < rect2.y || rect1.y > r2y2 )
    {
      return false;
    }
    else
    {
      return true;
    }
  }
  
  
  /**
   * Intersection of rectangle and a line.
   * @param line the line.
   * @param rect the rectangle.
   * @return true if the line intersects the rectangle.
   */
  
  public static final boolean lineRectangle(Line2D.Float line,
                                            Rectangle2D.Float rect)
  {
    if (rect.intersectsLine(line)) {
      return true;
    }
    else {
      return false;
    }
  }
  
  /**
   * Intersection of rectangle and circle (Arvo's algorithm).
   * @param rect the rectangle.
   * @param centre the circle centre.
   * @param radius the circle radius.
   * @return true if the shapes intersect.
   */
  
  public static final boolean rectangleCircle(Rectangle2D.Float rect,
                                              Point2D.Float centre,
                                              float radius)
  {
    float rightEdge = rect.x + rect.width;
    float bottomEdge = rect.y + rect.height;
    float diff = 0f;

    if (centre.x < rect.x) {
      diff = rect.x - centre.x;
    }
    else if (centre.x > rightEdge) {
      diff = centre.x - rightEdge;
    }

    // xDistSq is the x distance from centre to the rectangle, squared.
    float xDistSq = diff * diff;
    diff = 0f;

    if (centre.y < rect.y) {
      diff = rect.y - centre.y;
    }
    else if (centre.y > bottomEdge) {
      diff = centre.y - bottomEdge;
    }

    // yDistSq is the y distance from centre to the rectangle, squared.
    float yDistSq = diff * diff;

    // pythagoras: if r*r = xDistSq + yDistSq, then exactly touching
    return ( (xDistSq + yDistSq) < (radius * radius) );
  }  
}