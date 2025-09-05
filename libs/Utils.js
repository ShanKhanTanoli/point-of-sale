// Require
const crypto = require('crypto');

// Set of invalid values
const invalidValues = new Set(['', null, undefined, 'null', 'undefined']);

 /* Formatted date time
 * @param {*} input 
 * @returns String
 */
exports.formateDateTimeString = (input) => {
  const date = new Date(input);
  const formatted = date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  return formatted;
}

/**
 * Check for the value
 * @param {*} val 
 * @returns Boolean
 */
exports.checkForValue = (val) => !invalidValues.has(val);

/**
 * Hash a string
 * @param {*} stringToHash 
 * @returns Hashed string
 */
exports.createHash = (stringToHash) => crypto.createHash('md5').update(stringToHash).digest('hex');