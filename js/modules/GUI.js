'use strict';

// CLAUDE-TODO: These dependencies should be imported from their respective modules when converted
const Keys = {
  switchControls: () => console.log('Keys.switchControls called')
};

const Player = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 }
};

const Camera = {
  MODE_FIRST_PERSON: 'first person',
  MODE_CHASE: 'chase',
  MODE_ORBIT: 'orbit',
  MODE_TOP_DOWN: 'top down',
  CHASE_HEIGHT: 80,
  CHASE_DISTANCE: 220,
  CHASE_ANGLE_DOWN: -0.17
};

const clock = {
  multiplier: 1
};

// var global = Function('return this')(); // http://stackoverflow.com/questions/3277182/how-to-get-the-global-object-in-javascript

let gui = null;

export function init() {
  //gui = new dat.GUI();
  //addGeneralControls();
  //addPlayerControls();
  //addCameraControls();
}

export function addGeneralControls() {
  var guiControls = gui.addFolder('Controls');
  //guiControls.add(global, 'State.isPaused').name('paused (p)').listen();
  guiControls.add(clock, 'multiplier', 0, 2000).step(50).name('time multiplier');
  guiControls.add(Keys, 'switchControls').name('toggle controls (c)');
}

export function addPlayerControls() {
  var guiPlayer = gui.addFolder('Player');
  //guiPlayer.open();
  guiPlayer.add(Player.position, 'x').listen().name('x');
  guiPlayer.add(Player.position, 'y').listen().name('y');
  guiPlayer.add(Player.position, 'z').listen().name('z');
  // The step values here depend on a dat.gui patch from https://code.google.com/p/dat-gui/issues/detail?id=31
  guiPlayer.add(Player.rotation, 'x').step(0.01).listen().name('rotated x');
  guiPlayer.add(Player.rotation, 'y').step(0.01).listen().name('rotated y');
  guiPlayer.add(Player.rotation, 'z').step(0.01).listen().name('rotated z');
}

export function addCameraControls() {
  var guiCamera = gui.addFolder('Camera');
  guiCamera.open();
  guiCamera.add(Camera, 'mode', [Camera.MODE_FIRST_PERSON, Camera.MODE_CHASE, Camera.MODE_ORBIT, Camera.MODE_TOP_DOWN]).listen();
  guiCamera.add(Camera, 'CHASE_HEIGHT', 0, 300).step(10);
  guiCamera.add(Camera, 'CHASE_DISTANCE', 0, 400).step(10);
  guiCamera.add(Camera, 'CHASE_ANGLE_DOWN', -0.5, 0.5).step(0.01);
}

// Getters for module state
export function getGui() { return gui; }
export function setGui(newGui) { gui = newGui; }

// Export default object for backward compatibility
export default {
  init,
  addGeneralControls,
  addPlayerControls,
  addCameraControls,
  getGui,
  setGui
};