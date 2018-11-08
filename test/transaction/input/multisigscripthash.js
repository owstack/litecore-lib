'use strict';
/* jshint unused: false */

var expect = require('chai').expect;
var should = require('chai').should();

var owsCommon = require('@owstack/ows-common');
var keyLib = require('@owstack/key-lib');
var ltcLib = require('../../..');
var Address = ltcLib.Address;
var PrivateKey = keyLib.PrivateKey;
var MultiSigScriptHashInput = ltcLib.Transaction.Input.MultiSigScriptHash;
var Script = ltcLib.Script;
var Signature = keyLib.crypto.Signature;
var Transaction = ltcLib.Transaction;
var lodash = owsCommon.deps.lodash;

describe('MultiSigScriptHashInput', function() {

  var privateKey1 = new PrivateKey('T35QnUj2z2sAg5NHg8n73RaXvrgRQb6Ubk7jeHwYatXDHFvTPJyA');
  var privateKey2 = new PrivateKey('TAE7EKgdc8XHwfuv63iWt6VnKxdjgL587oXXhDmTfYp3n339ANkU');
  var privateKey3 = new PrivateKey('TA2ixrTAf2jULJcrLtrFcXWpcd2RjR4JsDamBGYCPsYHDrUoVdrp');
  var public1 = privateKey1.publicKey;
  var public2 = privateKey2.publicKey;
  var public3 = privateKey3.publicKey;
  var address = new Address('33zbk2aSZYdNbRsMPPt6jgy6Kq1kQreqeb');

  var output = {
    address: '33zbk2aSZYdNbRsMPPt6jgy6Kq1kQreqeb',
    txId: '66e64ef8a3b384164b78453fa8c8194de9a473ba14f89485a0e433699daec140',
    outputIndex: 0,
    script: new Script(address),
    litoshis: 1000000
  };
  it('can count missing signatures', function() {
    var transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000);
    var input = transaction.inputs[0];

    input.countSignatures().should.equal(0);

    transaction.sign(privateKey1);
    input.countSignatures().should.equal(1);
    input.countMissingSignatures().should.equal(1);
    input.isFullySigned().should.equal(false);

    transaction.sign(privateKey2);
    input.countSignatures().should.equal(2);
    input.countMissingSignatures().should.equal(0);
    input.isFullySigned().should.equal(true);
  });
  it('returns a list of public keys with missing signatures', function() {
    var transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000);
    var input = transaction.inputs[0];

    _.every(input.publicKeysWithoutSignature(), function(publicKeyMissing) {
      var serialized = publicKeyMissing.toString();
      return serialized === public1.toString() ||
              serialized === public2.toString() ||
              serialized === public3.toString();
    }).should.equal(true);
    transaction.sign(privateKey1);
    _.every(input.publicKeysWithoutSignature(), function(publicKeyMissing) {
      var serialized = publicKeyMissing.toString();
      return serialized === public2.toString() ||
              serialized === public3.toString();
    }).should.equal(true);
  });
  it('can clear all signatures', function() {
    var transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000)
      .sign(privateKey1)
      .sign(privateKey2);

    var input = transaction.inputs[0];
    input.isFullySigned().should.equal(true);
    input.clearSignatures();
    input.isFullySigned().should.equal(false);
  });
  it('can estimate how heavy is the output going to be', function() {
    var transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000);
    var input = transaction.inputs[0];
    input._estimateSize().should.equal(257);
  });
  it('uses SIGHASH_ALL by default', function() {
    var transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000);
    var input = transaction.inputs[0];
    var sigs = input.getSignatures(transaction, privateKey1, 0);
    sigs[0].sigtype.should.equal(Signature.SIGHASH_ALL);
  });
  it('roundtrips to/from object', function() {
    var transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000)
      .sign(privateKey1);
    var input = transaction.inputs[0];
    var roundtrip = new MultiSigScriptHashInput(input.toObject());
    roundtrip.toObject().should.deep.equal(input.toObject());
  });
  it('roundtrips to/from object when not signed', function() {
    var transaction = new Transaction()
      .from(output, [public1, public2, public3], 2)
      .to(address, 1000000);
    var input = transaction.inputs[0];
    var roundtrip = new MultiSigScriptHashInput(input.toObject());
    roundtrip.toObject().should.deep.equal(input.toObject());
  });
  it('will get the scriptCode for nested witness', function() {
    var address = Address.createMultisig([public1, public2, public3], 2, 'testnet', true);
    var utxo = {
      address: address.toString(),
      txId: '66e64ef8a3b384164b78453fa8c8194de9a473ba14f89485a0e433699daec140',
      outputIndex: 0,
      script: new Script(address),
      litoshis: 1000000
    };
    var transaction = new Transaction()
      .from(utxo, [public1, public2, public3], 2, true)
      .to(address, 1000000);
    var input = transaction.inputs[0];
    var scriptCode = input.getScriptCode();
    scriptCode.toString('hex').should.equal('695221025c95ec627038e85b5688a9b3d84d28c5ebe66e8c8d697d498e20fe96e3b1ab1d2102cdddfc974d41a62f1f80081deee70592feb7d6e6cf6739d6592edbe7946720e72103c95924e02c240b5545089c69c6432447412b58be43fd671918bd184a5009834353ae');
  });
  it('will get the litoshis buffer for nested witness', function() {
    var address = Address.createMultisig([public1, public2, public3], 2, 'testnet', true);
    var utxo = {
      address: address.toString(),
      txId: '66e64ef8a3b384164b78453fa8c8194de9a473ba14f89485a0e433699daec140',
      outputIndex: 0,
      script: new Script(address),
      litoshis: 1000000
    };
    var transaction = new Transaction()
      .from(utxo, [public1, public2, public3], 2, true)
      .to(address, 1000000);
    var input = transaction.inputs[0];
    var litoshisBuffer = input.getLitoshisBuffer();
    litoshisBuffer.toString('hex').should.equal('40420f0000000000');
  });

});
