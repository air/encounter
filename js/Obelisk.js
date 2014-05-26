'use strict';

var Obelisk = {};

Obelisk.HEIGHT = 100;
Obelisk.RADIUS = 40;
// topRadius, bottomRadius, height, segments, heightSegments
Obelisk.GEOMETRY = new THREE.CylinderGeometry(Obelisk.RADIUS, Obelisk.RADIUS, Obelisk.HEIGHT, 8, 1, false);
Obelisk.MATERIAL = new THREE.MeshBasicMaterial({ color: C64.black });

Obelisk.newInstance = function()
{
  return new THREE.Mesh(Obelisk.GEOMETRY, Obelisk.MATERIAL);
}
