"use strict";

// main
init3d();
initTestObjects();
document.body.appendChild(renderer.domElement);
initListeners();
animate();

function initTestObjects() {
  for (var p=0; p<C64.palette.length; p++) {
    var mat = new THREE.MeshLambertMaterial({ color : C64.palette[p] });
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(50, 20, 20), mat);
    sphere.position.x = -600 + (p*80);
    scene.add(sphere);
  }

  var light = new THREE.PointLight(C64.palette.white);
  light.position.y = 300;
  light.position.z = 100;
  scene.add(light);

  var light2 = new THREE.PointLight(C64.palette.white);
  light2.position.y = -300;
  light2.position.z = 100;
  scene.add(light2);

  camera.position.z=800;
  camera.position.y=400;
}

function update(t) {
  camera.lookAt(scene.position);
}