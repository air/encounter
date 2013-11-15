// Class definition style 3 of 3, see Shot and EncounterPhysics

// define this so we can define some constants on it
function Obelisk() {};

// static constants
// FIXME make caps
Obelisk.height = 100;
Obelisk.radius = 40;
Obelisk.geometry = new THREE.CylinderGeometry(Obelisk.radius, Obelisk.radius, Obelisk.height, 16, 1, false); // topRadius, bottomRadius, height, segments, heightSegments
Obelisk.material = MATS.normal;

//Obelisk.material = MATS.wireframe.clone();
//Obelisk.material.color = 0x000000;


// An Obelisk is_a THREE.Mesh.
//Obelisk.prototype = Object.create(THREE.Mesh.prototype); // inheritance style from THREE

// constructor with position
//function Obelisk(xPos, yPos) {
//  THREE.Mesh.call(this, Obelisk.geometry, Obelisk.material); // super constructor
//}

//Obelisk.prototype.update = function(t) {
//}
