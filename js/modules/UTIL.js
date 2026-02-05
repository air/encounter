'use strict';

//=============================================================================
// HTML/CSS
//=============================================================================

/**
 * Converts a CSS hex color string to a numeric value
 * @param {string} cssSixDigitColour - A CSS color string in format '#rrggbb'
 * @returns {number} The numeric representation of the color
 * @throws {Error} If input is invalid
 * @example
 * convertSixDigitCssRgbToNumeric('#ff6699') // returns 16737945
 */
export function convertSixDigitCssRgbToNumeric(cssSixDigitColour) {
  if (!cssSixDigitColour || typeof cssSixDigitColour !== 'string') {
    throw new Error('Invalid input: expected a string in format #rrggbb');
  }
  if (!cssSixDigitColour.startsWith('#') || cssSixDigitColour.length !== 7) {
    throw new Error('Invalid color format: expected #rrggbb, got ' + cssSixDigitColour);
  }
  var hexString = cssSixDigitColour.split('#')[1];
  var result = parseInt(hexString, 16);
  if (isNaN(result)) {
    throw new Error('Invalid hex color: ' + cssSixDigitColour);
  }
  return result;
}

//=============================================================================
// maths
//=============================================================================
export const TO_RADIANS = Math.PI / 180;
export const TO_DEGREES = 180 / Math.PI;

/**
 * Generate a random integer within a range (inclusive)
 * @param {number} min - Minimum value (or maximum if max is not provided)
 * @param {number} [max] - Maximum value (optional)
 * @returns {number} Random integer between min and max
 * @example
 * random(10) // returns 0-10
 * random(5, 10) // returns 5-10
 */
export function random(min, max) {
  // handle a single arg to mean 'between 0 and arg'
  if (max === undefined) {
    max = min;
    min = 0;
  }

  if (max > min) {
    var range = max - min + 1;
    return min + Math.floor(Math.random() * range);
  } else {
    panic('max ' + max + ' must be more than min ' + min);
    return 0;
  }
}

/**
 * Select a random element from an array
 * @param {Array} array - The array to select from
 * @returns {*} A random element from the array
 * @throws {Error} If array is empty or invalid
 */
export function randomFromArray(array) {
  if (!Array.isArray(array)) {
    throw new Error('Invalid input: expected an array');
  }
  if (array.length === 0) {
    throw new Error('Cannot select from empty array');
  }
  var diceRoll = random(1, array.length) - 1; // adjust to be array index
  return array[diceRoll];
}

//=============================================================================
// logging
//=============================================================================
/**
 * Log a message with timestamp
 * @param {string} msg - The message to log
 * @param {*} [object] - Optional object to log
 */
export function log(msg, object) {
  console.log(Math.floor(window.performance.now()) + ' ' + msg);
  if (object) {
    console.log(object);
  }
}

/**
 * Log an error message with timestamp
 * @param {string} msg - The error message
 */
export function error(msg) {
  console.error(Math.floor(window.performance.now()) + ' ' + msg);
}

/**
 * Log a critical error and break into debugger
 * @param {string} msg - The error message
 * @param {*} [object] - Optional object to log
 */
export function panic(msg, object) {
  console.error(msg);
  if (object) {
    console.log(object);
  }
  debugger;
}

//=============================================================================
// touch and mobile
//=============================================================================
/**
 * Check if the platform supports touch events
 * @returns {boolean} True if touch is supported
 * @note Returns false positive on Windows 8
 */
export function platformSupportsTouch() {
  return 'ontouchstart' in window;
}

// Default export for backward compatibility with existing global usage
const UTIL = {
  convertSixDigitCssRgbToNumeric,
  TO_RADIANS,
  TO_DEGREES,
  random,
  randomFromArray,
  platformSupportsTouch
};

export default UTIL;