'use strict';

var owsCommon = require('@owstack/ows-common');
var keyLib = require('@owstack/key-lib');
var networkLib = require('@owstack/network-lib');
var Unit = networkLib.Unit;
var inherits = require('inherits');
var lodash = owsCommon.deps.lodash;
var $ = owsCommon.util.preconditions;

/**
 * For object definition see https://github.com/owstack/key-lib/blob/master/lib/unit.js
 */

var UNITS =
  [{
    name: 'Litecoin',
    shortName: 'LTC',
    code: 'LTC',
    accessor: 'LTC',
    kind: 'standard',
    value: 100000000,
    precision: {
      full: {
        maxDecimals: 8,
        minDecimals: 8
      },
      short: {
        maxDecimals: 6,
        minDecimals: 2
      }
    }
  }, {
    name: 'mLTC (1,000 mLTC = 1LTC)',
    shortName: 'mLTC',
    code: 'mLTC',
    accessor: 'mLTC',
    kind: 'millis',
    value: 100000,
    precision: {
      full: {
        maxDecimals: 5,
        minDecimals: 5
      },
      short: {
        maxDecimals: 3,
        minDecimals: 2
      }
    }
  }, {
    name: 'uLTC (1,000,000 uLTC = 1LTC)',
    shortName: 'uLTC',
    code: 'uLTC',
    accessor: 'uLTC',
    kind: 'micros',
    value: 100,
    precision: {
      full: {
        maxDecimals: 2,
        minDecimals: 2
      },
      short: {
        maxDecimals: 2,
        minDecimals: 1
      }
    }
  }, {
    name: 'photons (1,000,000 photons = 1LTC)',
    shortName: 'photons',
    code: 'photon',
    accessor: 'photons',
    kind: 'photons',
    value: 100,
    precision: {
      full: {
        maxDecimals: 2,
        minDecimals: 2
      },
      short: {
        maxDecimals: 0,
        minDecimals: 0
      }
    }
  }, {
    name: 'litoshi (100,000,000 litoshi = 1LTC)',
    shortName: 'lits',
    code: 'litoshi',
    accessor: 'litoshis',
    kind: 'atomic',
    value: 1,
    precision: {
      full: {
        maxDecimals: 0,
        minDecimals: 0
      },
      short: {
        maxDecimals: 0,
        minDecimals: 0
      }
    }
  }];

/**
 * Utility for handling and converting currency units. The supported units are
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
 * var litoshis = Unit.fromLTC(1.3).toLitoshis();
 * var milli = Unit.fromPhotons(1.3).to(Unit.mLTC);
 * var photons = Unit.fromFiat(1.3, 350).photons;
 * var ltc = new Unit(1.3, Unit.photons).LTC;
 * ```
 *
 * @param {Number} amount - The amount to be represented
 * @param {String|Number} code - The unit of the amount or the exchange rate
 * @returns {Unit} A new instance of an Unit
 * @constructor
 */
function LtcUnit(amount, code) {
  if (!(this instanceof LtcUnit)) {
    return new LtcUnit(amount, code);
  }
  
  Unit.apply(this, [UNITS, amount, code]);
};
inherits(LtcUnit, Unit);

// Copy all static methods in our object.
Object.keys(Unit).forEach(function(key) {
  LtcUnit[key] = Unit[key];
});

/**
 * Create unit statics.
 * Example LtcUnit.LTC
 */
var unitKeys = lodash.map(UNITS, function(u) {
  return u.accessor;
});

unitKeys.forEach(function(key) {
  LtcUnit[key] = key;
});

/**
 * Constructors.
 * Returns a Unit instance created from the standard unit of measure.
 *
 * @param {Number} amount - The amount in standard units
 * @returns {Unit} A Unit instance
 */

LtcUnit.fromStandardUnit =
LtcUnit.fromLTC = function(amount) {
  return new LtcUnit(amount, LtcUnit.LTC);
};

LtcUnit.fromMillis = function(amount) {
  return new LtcUnit(amount, LtcUnit.mLTC);
};

LtcUnit.fromMicro = function(amount) {
  return new LtcUnit(amount, LtcUnit.uLTC);
};

LtcUnit.fromPhotons = function(amount) {
  return new LtcUnit(amount, LtcUnit.photons);
};

LtcUnit.fromAtomicUnit =
LtcUnit.fromLitoshis = function(amount) {
  return new LtcUnit(amount, LtcUnit.litoshis);
};

/**
 * Converters.
 * Returns the corresponding value from this Unit.
 *
 * @param {Number} amount - The amount in atomic units
 * @returns {Unit} A Unit instance
 */

LtcUnit.prototype.toLTC = function() {
  return this.to(LtcUnit.LTC);
};

LtcUnit.prototype.toMillis = function() {
  return this.to(LtcUnit.mLTC);
};

LtcUnit.prototype.toMicro = function() {
  return this.to(LtcUnit.uLTC);
};

LtcUnit.prototype.toPhotons = function() {
  return this.to(LtcUnit.photons);
};

LtcUnit.prototype.toLitoshis = function() {
  return this.to(LtcUnit.litoshis);
};

/**
 * Returns a Unit instance created from a fiat amount and exchange rate.
 *
 * @param {Number} amount - The amount in fiat
 * @param {Number} rate - The exchange rate; example LTC/USD
 * @returns {Unit} A Unit instance
 */
LtcUnit.fromFiat = function(amount, rate) {
  return new LtcUnit(amount, rate);
};

/**
 * Returns a Unit instance created from JSON string or object
 *
 * @param {String|Object} json - JSON with keys: amount and code
 * @returns {Unit} A Unit instance
 */
LtcUnit.fromObject = function(data) {
  $.checkArgument(lodash.isObject(data), 'Argument is expected to be an object');
  return new LtcUnit(data.amount, data.code);
};

module.exports = LtcUnit;
