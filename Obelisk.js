// Class definition style 3 of 3, see Shot and EncounterPhysics

// define this so we can define some constants on it
function Obelisk() {};

// static constants
// FIXME make caps
Obelisk.HEIGHT = 100;
Obelisk.RADIUS = 40;
Obelisk.GEOMETRY = new THREE.CylinderGeometry(Obelisk.RADIUS, Obelisk.RADIUS, Obelisk.HEIGHT, 16, 1, false); // topRadius, bottomRadius, height, segments, heightSegments
Obelisk.MATERIAL = MATS.normal;

//Obelisk.MATERIAL = MATS.wireframe.clone();
//Obelisk.MATERIAL.color = 0x000000;


// An Obelisk is_a THREE.Mesh.
//Obelisk.prototype = Object.create(THREE.Mesh.prototype); // inheritance style from THREE

// constructor with position
//function Obelisk(xPos, yPos) {
//  THREE.Mesh.call(this, Obelisk.GEOMETRY, Obelisk.MATERIAL); // super constructor
//}

//Obelisk.prototype.update = function(t) {
//}
