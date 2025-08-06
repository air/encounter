'use strict';

import { random } from './UTIL.js';

// Gamma-corrected RGB values from http://www.pepto.de/projects/colorvic/

// TODO use THREE.Color

export const palette = [
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
];

export const cssPalette = [
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
];

export const black = palette[0];
export const white = palette[1];
export const red = palette[2];
export const cyan = palette[3];
export const purple = palette[4];
export const green = palette[5];
export const blue = palette[6];
export const yellow = palette[7];
export const orange = palette[8];
export const brown = palette[9];
export const lightred = palette[10];
export const darkgrey = palette[11];
export const grey = palette[12];
export const lightgreen = palette[13];
export const lightblue = palette[14];
export const lightgrey = palette[15];

export const css = {
  black: cssPalette[0],
  white: cssPalette[1],
  red: cssPalette[2],
  cyan: cssPalette[3],
  purple: cssPalette[4],
  green: cssPalette[5],
  blue: cssPalette[6],
  yellow: cssPalette[7],
  orange: cssPalette[8],
  brown: cssPalette[9],
  lightred: cssPalette[10],
  darkgrey: cssPalette[11],
  grey: cssPalette[12],
  lightgreen: cssPalette[13],
  lightblue: cssPalette[14],
  lightgrey: cssPalette[15]
};

export function randomColour() {
  var diceRoll = random(1, palette.length) - 1;
  return palette[diceRoll];
}

export function randomCssColour() {
  var diceRoll = random(1, cssPalette.length) - 1;
  return cssPalette[diceRoll];
}

// Default export for backward compatibility with existing global usage
const C64 = {
  palette,
  cssPalette,
  black,
  white,
  red,
  cyan,
  purple,
  green,
  blue,
  yellow,
  orange,
  brown,
  lightred,
  darkgrey,
  grey,
  lightgreen,
  lightblue,
  lightgrey,
  css,
  randomColour,
  randomCssColour
};

export default C64;