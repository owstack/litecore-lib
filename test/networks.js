'use strict';

var expect = require('chai').expect;
var should = require('chai').should();

var owsCommon = require('@owstack/ows-common');
var ltcLib = require('..');
var Networks = ltcLib.Networks;
var lodash = owsCommon.deps.lodash;

describe('Networks', function() {

  it('will get network based on string symbol value', function() {
    var network = Networks.get('LTC');
    network.should.equal(Networks.livenet);
    network.should.equal(Networks.mainnet);
    network.should.equal(Networks.defaultNetwork);
    var network = Networks.get('REGTEST');
    network.should.equal(Networks.regtest);
    var network = Networks.get('TESTNET');
    network.should.equal(Networks.testnet);
  });

  it('should change the default network', function() {
    Networks.defaultNetwork.should.equal(Networks.livenet);
    Networks.defaultNetwork = Networks.testnet;
    Networks.defaultNetwork.should.equal(Networks.testnet);
    Networks.defaultNetwork = Networks.get('LTC');
    Networks.defaultNetwork.should.equal(Networks.livenet);
  });

  var constants = [
    'name',
    'symbol',
    'coin',
    'protocol',
    'prefix.pubkeyhash',
    'prefix.privatekey',
    'prefix.scripthash', 
    'version.xpubkey',
    'version.xprivkey',
    'networkMagic'];

  constants.forEach(function(key) {
    it('should have constant ' + key + ' for all networks', function() {
      lodash.has(Networks.get('LTC'), key).should.equal(true);
      lodash.has(Networks.get('REGTEST'), key).should.equal(true);
      lodash.has(Networks.get('TESTNET'), key).should.equal(true);
    });
  });

  it('tests only for the specified key', function() {
    expect(Networks.get(0x30, 'prefix.pubkeyhash')).to.equal(Networks.get('LTC'));
    // Testnet and Regtest have the same pubkeyhash value.
    expect(Networks.get(0x6f, 'prefix.pubkeyhash').alias).to.equal(Networks.get('TESTNET').alias);
    expect(Networks.get(0x6f, 'prefix.pubkeyhash').alias).to.equal(Networks.testnet.alias);
    expect(Networks.get(0xa0, 'prefix.privatekey')).to.equal(undefined);
  });

  it('can test for multiple keys', function() {
    expect(Networks.get(0x32, ['prefix.pubkeyhash', 'prefix.scripthash'])).to.equal(Networks.get('LTC'));
    // Testnet and Regtest have the same pubkeyhash value.
    expect(Networks.get(0x6f, ['prefix.pubkeyhash', 'prefix.scripthash']).alias).to.equal(Networks.get('TESTNET').alias);
    expect(Networks.get(0x3a, ['prefix.pubkeyhash', 'prefix.scripthash']).alias).to.equal(Networks.get('TESTNET').alias);
    expect(Networks.get(0xa0, ['prefix.privatekey', 'port'])).to.equal(undefined);
  });

  it('converts to string using the "name" property', function() {
    Networks.get('LTC').toString().should.equal('LTC');
  });

  it('network object should be immutable', function() {
    expect(Networks.get('LTC').symbol).to.equal('LTC')
    var fn = function() { Networks.get('LTC').symbol = 'Something else' }
    expect(fn).to.throw(TypeError)
  });

});
