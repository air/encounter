'use strict';

// constructor. Pass an array of colors (hex numbers), and the number of frames to display each.
// fun example:
// new FlickeringBasicMaterial(MY3.COLORMAP_BASE16.map(function(col) { return Number(col[1]); }), 1);
class FlickeringBasicMaterial extends THREE.MeshBasicMaterial
{
  constructor (hexArray, framesForEach) {
    if ( !(hexArray instanceof Array) )
    {
      panic('hexArray not an Array');
    }
    if (typeof(hexArray[0]) !== 'number')
    {
      panic('hexArray must contain numbers');
    }
    if (hexArray.length < 1)
    {
      panic('hexArray is empty');
    }
    if (framesForEach === undefined)
    {
      panic('framesForEach undefined');
    }

    super();

    // config. Create Color objects out of the hex values
    this.colorArray = hexArray.map(function(color) { return new THREE.Color(color); });
    this.framesForEach = framesForEach;

    // current state
    this.frameCounter = 0;
    this.currentColor = 0;
    this.color = this.colorArray[this.currentColor];
  }

  tick()
  {
    this.frameCounter += 1;
    // change the color if needed
    if (this.frameCounter === this.framesForEach)
    {
      this.currentColor += 1;
      if (this.currentColor === this.colorArray.length)
      {
        this.currentColor = 0;
      }
      this.color = this.colorArray[this.currentColor];

      // reset counter
      this.frameCounter = 0;
    }
  }
}
