import { log, error, panic } from '/js/UTIL.js';

var GUI = {};

// var global = Function('return this')(); // http://stackoverflow.com/questions/3277182/how-to-get-the-global-object-in-javascript

GUI.gui = null;

GUI.init = function()
{
  //GUI.gui = new dat.GUI();
  //GUI.addGeneralControls();
  //GUI.addPlayerControls();
  //GUI.addCameraControls();
};

GUI.addGeneralControls = function()
{
  var guiControls = GUI.gui.addFolder('Controls');
  //guiControls.add(global, 'State.isPaused').name('paused (p)').listen();
  guiControls.add(MY3.clock, 'multiplier', 0, 2000).step(50).name('time multiplier');
  guiControls.add(Keys, 'switchControls').name('toggle controls (c)');
};

GUI.addPlayerControls = function()
{
  var guiPlayer = GUI.gui.addFolder('Player');
  //guiPlayer.open();
  guiPlayer.add(Player.position, 'x').listen().name('x');
  guiPlayer.add(Player.position, 'y').listen().name('y');
  guiPlayer.add(Player.position, 'z').listen().name('z');
  // The step values here depend on a dat.gui patch from https://code.google.com/p/dat-gui/issues/detail?id=31
  guiPlayer.add(Player.rotation, 'x').step(0.01).listen().name('rotated x');
  guiPlayer.add(Player.rotation, 'y').step(0.01).listen().name('rotated y');
  guiPlayer.add(Player.rotation, 'z').step(0.01).listen().name('rotated z');
};

GUI.addCameraControls = function()
{
  var guiCamera = GUI.gui.addFolder('Camera');
  guiCamera.open();
  guiCamera.add(Camera, 'mode', [Camera.MODE_FIRST_PERSON, Camera.MODE_CHASE, Camera.MODE_ORBIT, Camera.MODE_TOP_DOWN]).listen();
  guiCamera.add(Camera, 'CHASE_HEIGHT', 0, 300).step(10);
  guiCamera.add(Camera, 'CHASE_DISTANCE', 0, 400).step(10);
  guiCamera.add(Camera, 'CHASE_ANGLE_DOWN', -0.5, 0.5).step(0.01);
};
