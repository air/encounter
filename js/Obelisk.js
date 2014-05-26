'use strict';

var Obelisk = {};

Obelisk.HEIGHT = 100;
Obelisk.RADIUS = 40;
// topRadius, bottomRadius, height, segments, heightSegments
Obelisk.GEOMETRY = new THREE.CylinderGeometry(Obelisk.RADIUS, Obelisk.RADIUS, Obelisk.HEIGHT, 8, 1, false);
Obelisk.MATERIAL = new THREE.MeshBasicMaterial({ color: C64.black });

// return a Mesh for a single Obelisk. Not normally used since all Obelisk meshes are merged in Grid.
Obelisk.newMeshInstance = function(position)
{
  var mesh = new THREE.Mesh(Obelisk.GEOMETRY, Obelisk.MATERIAL);
  if (typeof position !== 'undefined')
  {
    mesh.position.copy(position);
  }
  return mesh;
}

// return a lightweight object containing essential Obelisk data.
Obelisk.newInstance = function()
{
  var obelisk = {};
  obelisk.position = new THREE.Vector3();
  return obelisk;
}
