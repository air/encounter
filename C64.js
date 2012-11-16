// Gamma-corrected RGB values from http://www.pepto.de/projects/colorvic/

if (C64 == null || typeof(C64) != "object") { var C64 = new Object(); } else { console.error('can\'t reserve namespace C64'); }

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
  0x959595);

C64.palette.black = C64.palette[0];
C64.palette.white = C64.palette[1];
C64.palette.red = C64.palette[2];
C64.palette.cyan = C64.palette[3];
C64.palette.purple = C64.palette[4];
C64.palette.green = C64.palette[5];
C64.palette.blue = C64.palette[6];
C64.palette.yellow = C64.palette[7];
C64.palette.orange = C64.palette[8];
C64.palette.brown = C64.palette[9];
C64.palette.lightred = C64.palette[10];
C64.palette.darkgrey = C64.palette[11];
C64.palette.grey = C64.palette[12];
C64.palette.lightgreen = C64.palette[13];
C64.palette.lightblue = C64.palette[14];
C64.palette.lightgrey = C64.palette[15];
