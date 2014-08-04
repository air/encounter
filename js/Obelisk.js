'use strict';

var Obelisk = {};

Obelisk.HEIGHT = 100;
Obelisk.RADIUS = 40;
// topRadius, bottomRadius, height, segments, heightSegments
Obelisk.GEOMETRY = new THREE.CylinderGeometry(Obelisk.RADIUS, Obelisk.RADIUS, Obelisk.HEIGHT, 12, 1, false);
// default to white material to test that color is loaded from Level data
Obelisk.MATERIAL = new THREE.MeshBasicMaterial({ color: C64.white });

// return a Mesh for a single Obelisk. Grid manages merging these into a single geometry.
Obelisk.newMeshInstance = function(position)
{
  var mesh = new THREE.Mesh(Obelisk.GEOMETRY, Obelisk.MATERIAL);
  if (typeof position !== 'undefined')
  {
    mesh.position.copy(position);
  }
  return mesh;
};
