var THREE = require('three');
var MY3 = require('../js/MY3.js');
var Physics = require('../js/Physics.js');
var expect = require('chai').expect;

describe("Physics.moveCircleOutOfStaticCircle", function() {
  var staticPoint = new THREE.Vector3(1, 0, 1);
  var staticRadius = 1;
  var movingPoint;
  var movingRadius;

  it("throws when circles are not colliding", function() {
    movingPoint = new THREE.Vector3(3, 0, 3);
    movingRadius = 1;
    expect(function() {Physics.moveCircleOutOfStaticCircle(staticPoint, staticRadius, movingPoint, movingRadius)}).to.throw();
  });

  it("separates 1,1 from 2,2 correctly when both have radius 1", function() {
    movingPoint = new THREE.Vector3(2, 0, 2);
    movingRadius = 1;
    var movement = Physics.moveCircleOutOfStaticCircle(staticPoint, staticRadius, movingPoint, movingRadius);
    expect(movingPoint.x).to.be.closeTo(2.41, 0.005);
    expect(movingPoint.z).to.be.closeTo(2.41, 0.005);
    expect(movement.x).to.be.closeTo(0.41, 0.005);
    expect(movement.z).to.be.closeTo(0.41, 0.005);
  });

  it("throws due to non-collision if you try to separate again after you've just separated", function() {
    movingPoint = new THREE.Vector3(2, 0, 2);
    movingRadius = 1;
    var movement = Physics.moveCircleOutOfStaticCircle(staticPoint, staticRadius, movingPoint, movingRadius);
    expect(function() {Physics.moveCircleOutOfStaticCircle(staticPoint, staticRadius, movingPoint, movingRadius)}).to.throw();
  });
});

describe("Physics.bounceObjectOutOfIntersectingCircle", function() {
  var staticPoint = new THREE.Vector3(1, 0, 1);
  var staticRadius = 1;
  var object;

  // all tests against a static point at 1,1 with radius 1.

  it("rotates correctly to 1,1 when heading -1,-1 and colliding square on from NE", function() {
    object = new THREE.Object3D();
    object.position.set(2, 0, 2);
    object.radius=1;
    object.rotation.y = Math.PI/4; // +45 degrees anticlockwise from negative Z is -1,-1
    Physics.bounceObjectOutOfIntersectingCircle(staticPoint, staticRadius, object, object.radius);
    expect(object.rotation.y).to.be.closeTo((Math.PI / 4) * -3, 0.001);
  });

  it("rotates correctly to -1,-1 when heading 1,1 and colliding square on from SW", function() {
    object = new THREE.Object3D();
    object.position.set(0, 0, 0);
    object.radius=1;
    object.rotation.y = (Math.PI/4) * -3; // -135 degrees anticlockwise from negative Z is 1,1
    Physics.bounceObjectOutOfIntersectingCircle(staticPoint, staticRadius, object, object.radius);
    expect(object.rotation.y).to.be.closeTo(Math.PI / 4, 0.001);
  });
});

describe("MY3.vectorToRotation", function() {
  // these would be true if the three.js coord system had zero pointing up X axis, but it doesn't.
  /*
  it("knows that vector 1,0,0 is due north or zero radians", function() {
    expect(MY3.vectorToRotation(new THREE.Vector3(1, 0, 0))).to.equal(0);
  });
  it("knows that vector -1,0,0 is due south or PI radians", function() {
    expect(MY3.vectorToRotation(new THREE.Vector3(-1, 0, 0))).to.equal(Math.PI);
  });
  it("knows that vector 1,0,1 (normalized) is NE or quarter PI radians", function() {
    expect(MY3.vectorToRotation(new THREE.Vector3(1, 0, 1).normalize())).to.be.closeTo(Math.PI/4);
  });
  */
  // as it is, zero points down Z axis and goes anti clockwise. So:
  it("knows that vector N 1,0,0 in three.js is -90 degrees or -2 quarter PI radians", function() {
    expect(MY3.vectorToRotation(new THREE.Vector3(1, 0, 0))).to.be.closeTo(Math.PI / -2, 0.001);
  });
  it("knows that vector S -1,0,0 in three.js is 90 degrees or 2 quarter PI radians", function() {
    expect(MY3.vectorToRotation(new THREE.Vector3(-1, 0, 0))).to.be.closeTo(Math.PI / 2, 0.001);
  });
  it("knows that vector W 0,0,-1 in three.js is zero radians", function() {
    expect(MY3.vectorToRotation(new THREE.Vector3(0, 0, -1))).to.equal(0);
  });
  it("knows that vector E 0,0,1 in three.js is 180 degrees or PI radians", function() {
    expect(MY3.vectorToRotation(new THREE.Vector3(0, 0, 1))).to.equal(-Math.PI);
  });
  it("knows that vector SW -1,0,-1 (normalized) is 45 or quarter PI radians", function() {
    expect(MY3.vectorToRotation(new THREE.Vector3(-1, 0, -1).normalize())).to.be.closeTo(Math.PI / 4, 0.001);
  });
  it("knows that vector SE -1,0,1 (normalized) is 135 degrees or 3 quarter PI radians", function() {
    expect(MY3.vectorToRotation(new THREE.Vector3(-1, 0, 1).normalize())).to.be.closeTo((Math.PI / 4) * 3, 0.001);
  });
  it("knows that vector NE 1,0,1 (normalized) is -135 degrees or -3 quarter PI radians", function() {
    expect(MY3.vectorToRotation(new THREE.Vector3(1, 0, 1).normalize())).to.be.closeTo((Math.PI / 4) * -3, 0.001);
  });
  it("knows that vector NW 1,0,-1 (normalized) is -45 degrees or -quarter PI radians", function() {
    expect(MY3.vectorToRotation(new THREE.Vector3(1, 0, -1).normalize())).to.be.closeTo(-(Math.PI / 4), 0.001);
  });
});