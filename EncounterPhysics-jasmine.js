var physics = new EncounterPhysics();

describe("moveCircleOutOfStaticCircle", function() {
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
    expect(movingPoint.x == 2.414214562373095);
    expect(movingPoint.z == 2.414214562373095);
    expect(movement.x == 0.41421456237309495);
    expect(movement.z == 0.41421456237309495);
  });

  it("throws due to non-collision if you try to separate again after you've just separated", function() {
    movingPoint = new THREE.Vector3(2, 0, 2);
    movingRadius = 1;
    var movement = physics.moveCircleOutOfStaticCircle(staticPoint, staticRadius, movingPoint, movingRadius);
    expect(function() {physics.moveCircleOutOfStaticCircle(staticPoint, staticRadius, movingPoint, movingRadius)}).toThrow();
  });
});