'use strict';

var owsCommon = require('@owstack/ows-common');
var errors = require('./errors');
var _ = require('lodash');
var $ = owsCommon.util.preconditions;


var UNITS =
  [{
    name: 'Litecoin',
    shortName: 'LTC',
    value: 100000000,
    decimals: 8,
    code: 'LTC',
    kind: 'standard'
  }, {
    name: 'mLTC (1,000 mLTC = 1LTC)',
    shortName: 'mLTC',
    value: 100000,
    decimals: 5,
    code: 'mLTC',
    kind: 'alternative'
  }, {
    name: 'uLTC (1,000,000 uLTC = 1LTC)',
    shortName: 'uLTC',
    value: 100,
    decimals: 2,
    code: 'uLTC',
    kind: 'alternative'
  }, {
    name: 'photons (1,000,000 photons = 1LTC)',
    shortName: 'photons',
    value: 100,
    decimals: 2,
    code: 'photon',
    kind: 'alternative'
  }, {
    name: 'litoshi (100,000,000 satoshi = 1LTC)',
    shortName: 'litoshis',
    value: 1,
    decimals: 0,
    code: 'litoshi',
    kind: 'atomic'
  }];

/**
 * Utility for handling and converting bitcoins units. The supported units are
 * LTC, mLTC, photons (also named uLTC) and litoshis. A unit instance can be created with an
 * amount and a unit code, or alternatively using static methods like {fromLTC}.
 * It also allows to be created from a fiat amount and the exchange rate, or
 * alternatively using the {fromFiat} static method.
 * You can consult for different representation of a unit instance using it's
 * {to} method, the fixed unit methods like {toLitoshis} or alternatively using
 * the unit accessors. It also can be converted to a fiat amount by providing the
 * corresponding LTC/fiat exchange rate.
 *
 * @example
 * ```javascript
 * var sats = Unit.fromLTC(1.3).toLitoshis();
 * var mili = Unit.fromBits(1.3).to(Unit.mLTC);
 * var photons = Unit.fromFiat(1.3, 350).photons;
 * var ltc = new Unit(1.3, Unit.photons).LTC;
 * ```
 *
 * @param {Number} amount - The amount to be represented
 * @param {String|Number} code - The unit of the amount or the exchange rate
 * @returns {Unit} A new instance of an Unit
 * @constructor
 */
function Unit(amount, code) {
  if (!(this instanceof Unit)) {
    return new Unit(amount, code);
  }

  // convert fiat to LTC
  if (_.isNumber(code)) {
    if (code <= 0) {
      throw new errors.Unit.InvalidRate(code);
    }
    amount = amount / code;
    code = Unit.LTC;
  }

  this._value = this._from(amount, code);

  var self = this;
  var defineAccesor = function(key) {
    Object.defineProperty(self, key, {
      get: function() { return self.to(key); },
      enumerable: true,
    });
  };

  var keys = _.map(UNITS, function(u) {
    return u.shortName;
  });

  keys.forEach(defineAccesor);
}

var keys = _.map(UNITS, function(u) {
  return u.shortName;
});

keys.forEach(function(key) {
  Unit[key] = key;
});

/**
 * Returns the available units
 *
 * @returns {array} An array of available units
 */
Unit.getUnits = function getUnits() {
  return UNITS;
};

/**
 * Returns a Unit instance created from JSON string or object
 *
 * @param {String|Object} json - JSON with keys: amount and code
 * @returns {Unit} A Unit instance
 */
Unit.fromObject = function fromObject(data){
  $.checkArgument(_.isObject(data), 'Argument is expected to be an object');
  return new Unit(data.amount, data.code);
};

/**
 * Returns a Unit instance created from an amount in LTC
 *
 * @param {Number} amount - The amount in LTC
 * @returns {Unit} A Unit instance
 */
Unit.fromLTC = function(amount) {
  return new Unit(amount, Unit.LTC);
};

/**
 * Returns a Unit instance created from an amount in mLTC
 *
 * @param {Number} amount - The amount in mLTC
 * @returns {Unit} A Unit instance
 */
Unit.fromMillis = Unit.fromMilis = function(amount) {
  return new Unit(amount, Unit.mLTC);
};

/**
 * Returns a Unit instance created from an amount in photons
 *
 * @param {Number} amount - The amount in photons
 * @returns {Unit} A Unit instance
 */
Unit.fromMicros = Unit.fromBits = function(amount) {
  return new Unit(amount, Unit.photons);
};

/**
 * Returns a Unit instance created from an amount in litoshis
 *
 * @param {Number} amount - The amount in litoshis
 * @returns {Unit} A Unit instance
 */
Unit.fromSatoshis = function(amount) {
  return new Unit(amount, Unit.litoshis);
};

/**
 * Returns a Unit instance created from a fiat amount and exchange rate.
 *
 * @param {Number} amount - The amount in fiat
 * @param {Number} rate - The exchange rate LTC/fiat
 * @returns {Unit} A Unit instance
 */
Unit.fromFiat = function(amount, rate) {
  return new Unit(amount, rate);
};

Unit.prototype._from = function(amount, code) {
  var unit = _.find(UNITS, function(u) {
    return u.shortName == code;
  });

  if (!unit) {
    throw new errors.Unit.UnknownCode(code);
  }
  return parseInt((amount * unit.value).toFixed());
};

/**
 * Returns the value represented in the specified unit
 *
 * @param {String|Number} code - The unit code or exchange rate
 * @returns {Number} The converted value
 */
Unit.prototype.to = function(code) {
  if (_.isNumber(code)) {
    if (code <= 0) {
      throw new errors.Unit.InvalidRate(code);
    }
    return parseFloat((this.LTC * code).toFixed(2));
  }

  var unit = _.find(UNITS, function(u) {
    return u.shortName == code;
  });

  if (!unit) {
    throw new errors.Unit.UnknownCode(code);
  }

  var value = this._value / unit.value;
  return parseFloat(value.toFixed(unit.decimals));
};

/**
 * Returns the value represented in LTC
 *
 * @returns {Number} The value converted to LTC
 */
Unit.prototype.toLTC = function() {
  return this.to(Unit.LTC);
};

/**
 * Returns the value represented in mLTC
 *
 * @returns {Number} The value converted to mLTC
 */
Unit.prototype.toMillis = Unit.prototype.toMilis = function() {
  return this.to(Unit.mLTC);
};

/**
 * Returns the value represented in photons
 *
 * @returns {Number} The value converted to photons
 */
Unit.prototype.toMicros = Unit.prototype.toBits = function() {
  return this.to(Unit.photons);
};

/**
 * Returns the value represented in litoshis
 *
 * @returns {Number} The value converted to litoshis
 */
Unit.prototype.toLitoshis = function() {
  return this.to(Unit.litoshis);
};

/**
 * Returns the value represented in fiat
 *
 * @param {string} rate - The exchange rate between LTC/currency
 * @returns {Number} The value converted to litoshis
 */
Unit.prototype.atRate = function(rate) {
  return this.to(rate);
};

/**
 * Returns a the string representation of the value in litoshis
 *
 * @returns {string} the value in litoshis
 */
Unit.prototype.toString = function() {
  return this.litoshis + ' litoshis';
};

/**
 * Returns a plain object representation of the Unit
 *
 * @returns {Object} An object with the keys: amount and code
 */
Unit.prototype.toObject = Unit.prototype.toJSON = function toObject() {
  return {
    amount: this.LTC,
    code: Unit.LTC
  };
};

/**
 * Returns a string formatted for the console
 *
 * @returns {string} the value in litoshis
 */
Unit.prototype.inspect = function() {
  return '<Unit: ' + this.toString() + '>';
};

module.exports = Unit;
