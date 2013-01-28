var physics = new EncounterPhysics();

describe("physics.moveCircleOutOfStaticCircle", function() {
  var staticPoint = new THREE.Vector3(1, 0, 1);
  var staticRadius = 1;
  var movingPoint;
  var movingRadius;

  it("throws when circles are not colliding", function() {
    movingPoint = new THREE.Vector3(3, 0, 3);
    movingRadius = 1;
    expect(function() {physics.moveCircleOutOfStaticCircle(staticPoint, staticRadius, movingPoint, movingRadius)}).toThrow();
  });

  it("separates 1,1 from 2,2 correctly when both have radius 1", function() {
    movingPoint = new THREE.Vector3(2, 0, 2);
    movingRadius = 1;
    var movement = physics.moveCircleOutOfStaticCircle(staticPoint, staticRadius, movingPoint, movingRadius);
    expect(movingPoint.x).toBeCloseTo(2.41);
    expect(movingPoint.z).toBeCloseTo(2.41);
    expect(movement.x).toBeCloseTo(0.41);
    expect(movement.z).toBeCloseTo(0.41);
  });

  it("throws due to non-collision if you try to separate again after you've just separated", function() {
    movingPoint = new THREE.Vector3(2, 0, 2);
    movingRadius = 1;
    var movement = physics.moveCircleOutOfStaticCircle(staticPoint, staticRadius, movingPoint, movingRadius);
    expect(function() {physics.moveCircleOutOfStaticCircle(staticPoint, staticRadius, movingPoint, movingRadius)}).toThrow();
  });
});

describe("physics.bounceObjectOutOfIntersectingCircle", function() {
  var staticPoint = new THREE.Vector3(1, 0, 1);
  var staticRadius = 1;
  var object;

  // all tests against a static point at 1,1 with radius 1.
  // TODO: need to test all quadrants, some ok and some not.

  it("rotates correctly to 1,1 when heading -1,-1 and colliding square on from NE", function() {
    object = new THREE.Object3D();
    object.position.set(2, 0, 2);
    object.radius=1;
    object.rotation.y = Math.PI/4; // +45 degrees anticlockwise from negative Z is -1,-1
    physics.bounceObjectOutOfIntersectingCircle(staticPoint, staticRadius, object);
    expect(object.rotation.y).toBeCloseTo((Math.PI / 4) * -3);
  });

  it("rotates correctly to -1,-1 when heading 1,1 and colliding square on from SW", function() {
    object = new THREE.Object3D();
    object.position.set(0, 0, 0);
    object.radius=1;
    object.rotation.y = (Math.PI/4) * -3; // -135 degrees anticlockwise from negative Z is 1,1
    physics.bounceObjectOutOfIntersectingCircle(staticPoint, staticRadius, object);
    expect(object.rotation.y).toBeCloseTo(Math.PI / 4);
  });
});

describe("physics.unitVectorToRotation", function() {
  // these would be true if the three.js coord system had zero pointing up X axis, but it doesn't.
  /*
  it("knows that vector 1,0,0 is due north or zero radians", function() {
    expect(physics.unitVectorToRotation(new THREE.Vector3(1, 0, 0))).toEqual(0);
  });
  it("knows that vector -1,0,0 is due south or PI radians", function() {
    expect(physics.unitVectorToRotation(new THREE.Vector3(-1, 0, 0))).toEqual(Math.PI);
  });
  it("knows that vector 1,0,1 (normalized) is NE or quarter PI radians", function() {
    expect(physics.unitVectorToRotation(new THREE.Vector3(1, 0, 1).normalize())).toBeCloseTo(Math.PI/4);
  });
  */
  // as it is, zero points down Z axis and goes anti clockwise. So:
  it("knows that vector 0,0,-1 in three.js is zero radians", function() {
    expect(physics.unitVectorToRotation(new THREE.Vector3(0, 0, -1))).toEqual(0);
  });
  it("knows that vector 0,0,1 in three.js is 180 degrees or PI radians", function() {
    expect(physics.unitVectorToRotation(new THREE.Vector3(0, 0, 1))).toEqual(Math.PI);
  });
  it("knows that vector -1,0,-1 (normalized) is 45 or quarter PI radians", function() {
    expect(physics.unitVectorToRotation(new THREE.Vector3(-1, 0, -1).normalize())).toBeCloseTo(Math.PI / 4);
  });
});