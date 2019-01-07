'use strict';

var owsCommon = require('@owstack/ows-common');
var networkLib = require('@owstack/network-lib');
var Address = require('./address');
var Networks = require('./networks');
var Unit = require('./unit');
var URI = networkLib.URI;
var inherits = require('inherits');

/**
 * Represents a litecoin URI.
 * @constructor
 */
function LtcURI(data, knownParams) {
  URI.apply(this, [Address, Networks, Unit, data, knownParams]);
};
inherits(LtcURI, URI);

// Access static methods.
Object.keys(URI).forEach(function(key) {
  LtcURI[key] = URI[key];
});

/**
 * Check if a litecoin URI string is valid
 *
 * @example
 * ```javascript
 *
 * var valid = URI.isValid('litecoin:LQ9hsXxwkqG7C8rwjUktmvRUvhat7Qh8BQ');
 * // true
 * ```
 *
 * @param {string|Object} data - A litecoin URI string or an Object
 * @param {Array.<string>=} knownParams - Required non-standard params
 * @returns {boolean} Result of uri validation
 */
LtcURI.isValid = function(data, knownParams) {
  try {
    new LtcURI(data, knownParams);
  } catch (err) {
    return false;
  }
  return true;
};

/**
 * Returns the protocol string for the network.
 *
 * @returns {string} The protocol string
 */
LtcURI.prototype.getProtocol = function() {
  return Networks.getProtocol();
};

/**
 * Convert a URI string into a simple object.
 *
 * @param {string} uri - A litecoin cash URI string
 * @throws {TypeError} Invalid litecoin cash URI
 * @returns {Object} An object with the parsed params
 */
LtcURI.parse = function(uri) {
  return URI.parseWithNetworks(Networks.getProtocols(), uri);
};

/**
 * Instantiate a URI from a String
 *
 * @param {string} str - JSON string or object of the URI
 * @returns {URI} A new instance of a URI
 */
LtcURI.fromString = function(str) {
  if (typeof(str) !== 'string') {
    throw new TypeError('Expected a string');
  }
  return new LtcURI(str);
};

/**
 * Instantiate a URI from an Object
 *
 * @param {Object} data - object of the URI
 * @returns {URI} A new instance of a URI
 */
LtcURI.fromObject = function(obj) {
  return new LtcURI(obj);
};

module.exports = LtcURI;
