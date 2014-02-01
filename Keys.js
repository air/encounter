// TODO might need to re-add the domElement stuff from SimpleControls.js

Keys = function()
{
  this.shooting = false;

  Keys.prototype.switchControls = function()
  {
    if (Controls.current instanceof SimpleControls)
    {
      Controls.useFlyControls();
    }
    else
    {
      Controls.useEncounterControls();
    }
  }

  function keyUp(event)
  {
    switch(event.keyCode)
    {
      case 67: // c
        this.switchControls();
        break;
      case 32: // space
      case 90: // z
        this.shooting = false;
        break;
      case 80: // p
        isPaused = !isPaused;
        break;
    }
  };

  function keyDown(event)
  {
    switch(event.keyCode)
    {
      case 32: // space
      case 90: // z
        this.shooting = true;
        break;
    }
  };

  document.addEventListener('keydown', keyDown.bind(this), false);
  document.addEventListener('keyup', keyUp.bind(this), false);

};
