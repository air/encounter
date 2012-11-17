
EncounterPhysics = function() {
  var lastHighlight = new THREE.Vector2();

  // Pass a Vector3 and the radius of the object
  // A rectangular bounding box check using modulus
  EncounterPhysics.prototype.isCloseToAnObelisk = function(position, radius) {
    if (typeof radius === "undefined") throw('required: radius');

    var collisionThreshold = OB.radius + radius; // must be this close together to touch
    var collisionMax = OB.spacing - collisionThreshold; // getting close to next Z line (obelisk)

    var distanceBeyondZLine = position.x % OB.spacing;
    // if we're further past than the radius sum, and not yet up to the next line minus that sum, we're safe
    if (distanceBeyondZLine > collisionThreshold && distanceBeyondZLine < collisionMax) return false;

    var distanceBeyondXLine = position.z % OB.spacing;
    if (distanceBeyondXLine > collisionThreshold && distanceBeyondXLine < collisionMax) return false;

    return true;
  };

  // pass a Vector3, return a Vector2
  EncounterPhysics.prototype.getClosestObelisk = function(position) {
    var xPos = Math.round(position.x / OB.spacing);
    xPos = THREE.Math.clamp(xPos, 0, OB.gridSizeX-1);

    var zPos = Math.round(position.z / OB.spacing);
    zPos = THREE.Math.clamp(zPos, 0, OB.gridSizeZ-1);

    return new THREE.Vector2(xPos, zPos);
  };

  EncounterPhysics.prototype.highlightObelisk = function(x, z) {
    OB.rows[z][x].material = MATS.red;
    OB.rows[z][x].scale.set(1, 3, 1);
  };

  EncounterPhysics.prototype.unHighlightObelisk = function(x, z) {
    OB.rows[z][x].material = MATS.normal;
    OB.rows[z][x].scale.set(1, 1, 1);
  };

};