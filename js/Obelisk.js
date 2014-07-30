'use strict';

var Obelisk = {};

Obelisk.HEIGHT = 100;
Obelisk.RADIUS = 40;
// topRadius, bottomRadius, height, segments, heightSegments
Obelisk.GEOMETRY = new THREE.CylinderGeometry(Obelisk.RADIUS, Obelisk.RADIUS, Obelisk.HEIGHT, 8, 1, false);
Obelisk.MATERIAL = new THREE.MeshBasicMaterial({ color: C64.black });

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
