'use strict';

var expect = require('chai').expect;
var should = require('chai').should();

var owsCommon = require('@owstack/ows-common');
var ltcLib = require('..');
var errors = owsCommon.errors;
var Unit = ltcLib.Unit;

describe('Unit', function() {

  it('can be created from a number and unit', function() {
    expect(function() {
      return new Unit(1.2, 'LTC');
    }).to.not.throw();
  });

  it('can be created from a number and exchange rate', function() {
    expect(function() {
      return new Unit(1.2, 350);
    }).to.not.throw();
  });

  it('has property accesors "LTC", "mLTC", "uLTC", "photons", and "litoshis"', function() {
    var unit = new Unit(1.2, 'LTC');
    unit.LTC.should.equal(1.2);
    unit.mLTC.should.equal(1200);
    unit.uLTC.should.equal(1200000);
    unit.photons.should.equal(1200000);
    unit.litoshis.should.equal(120000000);
  });

  it('a string amount is allowed', function() {
    var unit;

    unit = Unit.fromLTC('1.00001');
    unit.LTC.should.equal(1.00001);

    unit = Unit.fromMillis('1.00001');
    unit.mLTC.should.equal(1.00001);

    unit = Unit.fromPhotons('100');
    unit.photons.should.equal(100);

    unit = Unit.fromLitoshis('8999');
    unit.litoshis.should.equal(8999);

    unit = Unit.fromFiat('43', 350);
    unit.LTC.should.equal(0.12285714);
  });

  it('should have constructor helpers', function() {
    var unit;

    unit = Unit.fromLTC(1.00001);
    unit.LTC.should.equal(1.00001);

    unit = Unit.fromMillis(1.00001);
    unit.mLTC.should.equal(1.00001);

    unit = Unit.fromPhotons(100);
    unit.photons.should.equal(100);

    unit = Unit.fromLitoshis(8999);
    unit.litoshis.should.equal(8999);

    unit = Unit.fromFiat(43, 350);
    unit.LTC.should.equal(0.12285714);
  });

  it('converts to litoshis correctly', function() {
    /* jshint maxstatements: 25 */
    var unit;

    unit = Unit.fromLTC(1.3);
    unit.mLTC.should.equal(1300);
    unit.photons.should.equal(1300000);
    unit.litoshis.should.equal(130000000);

    unit = Unit.fromMillis(1.3);
    unit.LTC.should.equal(0.0013);
    unit.photons.should.equal(1300);
    unit.litoshis.should.equal(130000);

    unit = Unit.fromPhotons(1.3);
    unit.LTC.should.equal(0.0000013);
    unit.mLTC.should.equal(0.0013);
    unit.litoshis.should.equal(130);

    unit = Unit.fromLitoshis(3);
    unit.LTC.should.equal(0.00000003);
    unit.mLTC.should.equal(0.00003);
    unit.photons.should.equal(0.03);
  });

  it('takes into account floating point problems', function() {
    var unit = Unit.fromLTC(0.00000003);
    unit.mLTC.should.equal(0.00003);
    unit.photons.should.equal(0.03);
    unit.litoshis.should.equal(3);
  });

  it('exposes unit codes', function() {
    should.exist(Unit.LTC);
    Unit.LTC.should.equal('LTC');

    should.exist(Unit.mLTC);
    Unit.mLTC.should.equal('mLTC');

    should.exist(Unit.photons);
    Unit.photons.should.equal('photons');

    should.exist(Unit.litoshis);
    Unit.litoshis.should.equal('litoshis');
  });

  it('exposes a method that converts to different units', function() {
    var unit = new Unit(1.3, 'LTC');
    unit.to(Unit.LTC).should.equal(unit.LTC);
    unit.to(Unit.mLTC).should.equal(unit.mLTC);
    unit.to(Unit.photons).should.equal(unit.photons);
    unit.to(Unit.litoshis).should.equal(unit.litoshis);
  });

  it('exposes shorthand conversion methods', function() {
    var unit = new Unit(1.3, 'LTC');
    unit.toLTC().should.equal(unit.LTC);
    unit.toMillis().should.equal(unit.mLTC);
    unit.toPhotons().should.equal(unit.photons);
    unit.toLitoshis().should.equal(unit.litoshis);
  });

  it('can convert to fiat', function() {
    var unit = new Unit(1.3, 350);
    unit.atRate(350).should.equal(1.3);
    unit.to(350).should.equal(1.3);

    unit = Unit.fromLTC(0.0123);
    unit.atRate(10).should.equal(0.12);
  });

  it('toString works as expected', function() {
    var unit = new Unit(1.3, 'LTC');
    should.exist(unit.toString);
    unit.toString().should.be.a('string');
  });

  it('can be imported and exported from/to JSON', function() {
    var json = JSON.stringify({amount:1.3, code:'LTC'});
    var unit = Unit.fromObject(JSON.parse(json));
    JSON.stringify(unit).should.deep.equal(json);
  });

  it('importing from invalid JSON fails quickly', function() {
    expect(function() {
      return Unit.fromJSON('¹');
    }).to.throw();
  });

  it('inspect method displays nicely', function() {
    var unit = new Unit(1.3, 'LTC');
    unit.inspect().should.equal('<Unit: 130000000 lits>');
  });

  it('fails when the unit is not recognized', function() {
    expect(function() {
      return new Unit(100, 'USD');
    }).to.throw(errors.Unit.UnknownCode);
    expect(function() {
      return new Unit(100, 'LTC').to('USD');
    }).to.throw(errors.Unit.UnknownCode);
  });

  it('fails when the exchange rate is invalid', function() {
    expect(function() {
      return new Unit(100, -123);
    }).to.throw(errors.Unit.InvalidRate);
    expect(function() {
      return new Unit(100, 'LTC').atRate(-123);
    }).to.throw(errors.Unit.InvalidRate);
  });

});
