// Gamma-corrected RGB values from http://www.pepto.de/projects/colorvic/

// TODO use THREE.Color

var C64 = {};

C64.palette = new Array(
  0x000000,
  0xFFFFFF,
  0x68372B,
  0x70A4B2,
  0x6F3D86,
  0x588D43,
  0x352879,
  0xB8C76F,
  0x6F4F25,
  0x433900,
  0x9A6759,
  0x444444,
  0x6C6C6C,
  0x9AD284,
  0x6C5EB5,
  0x959595
);

C64.cssPalette = new Array(
  '#000000',
  '#FFFFFF',
  '#68372B',
  '#70A4B2',
  '#6F3D86',
  '#588D43',
  '#352879',
  '#B8C76F',
  '#6F4F25',
  '#433900',
  '#9A6759',
  '#444444',
  '#6C6C6C',
  '#9AD284',
  '#6C5EB5',
  '#959595'
);

C64.black = C64.palette[0];
C64.white = C64.palette[1];
C64.red = C64.palette[2];
C64.cyan = C64.palette[3];
C64.purple = C64.palette[4];
C64.green = C64.palette[5];
C64.blue = C64.palette[6];
C64.yellow = C64.palette[7];
C64.orange = C64.palette[8];
C64.brown = C64.palette[9];
C64.lightred = C64.palette[10];
C64.darkgrey = C64.palette[11];
C64.grey = C64.palette[12];
C64.lightgreen = C64.palette[13];
C64.lightblue = C64.palette[14];
C64.lightgrey = C64.palette[15];

C64.css = {};
C64.css.black = C64.cssPalette[0];
C64.css.white = C64.cssPalette[1];
C64.css.red = C64.cssPalette[2];
C64.css.cyan = C64.cssPalette[3];
C64.css.purple = C64.cssPalette[4];
C64.css.green = C64.cssPalette[5];
C64.css.blue = C64.cssPalette[6];
C64.css.yellow = C64.cssPalette[7];
C64.css.orange = C64.cssPalette[8];
C64.css.brown = C64.cssPalette[9];
C64.css.lightred = C64.cssPalette[10];
C64.css.darkgrey = C64.cssPalette[11];
C64.css.grey = C64.cssPalette[12];
C64.css.lightgreen = C64.cssPalette[13];
C64.css.lightblue = C64.cssPalette[14];
C64.css.lightgrey = C64.cssPalette[15];