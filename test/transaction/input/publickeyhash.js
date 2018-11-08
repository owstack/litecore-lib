'use strict';
/* jshint unused: false */

var expect = require('chai').expect;
var should = require('chai').should();

var owsCommon = require('@owstack/ows-common');
var keyLib = require('@owstack/key-lib');
var ltcLib = require('../../..');
var Address = ltcLib.Address;
var PrivateKey = keyLib.PrivateKey;
var Networks = ltcLib.Networks;
var Script = ltcLib.Script;
var Signature = keyLib.crypto.Signature;
var Transaction = ltcLib.Transaction;
var lodash = owsCommon.deps.lodash;

describe('PublicKeyHashInput', function() {

  var privateKey = new PrivateKey('T35QnUj2z2sAg5NHg8n73RaXvrgRQb6Ubk7jeHwYatXDHFvTPJyA');
  var publicKey = privateKey.publicKey;
  var address = new Address(publicKey, Networks.livenet);

  var output = {
    address: '33zbk2aSZYdNbRsMPPt6jgy6Kq1kQreqeb',
    txId: '66e64ef8a3b384164b78453fa8c8194de9a473ba14f89485a0e433699daec140',
    outputIndex: 0,
    script: new Script(address),
    litoshis: 1000000
  };
  it('can count missing signatures', function() {
    var transaction = new Transaction()
      .from(output)
      .to(address, 1000000);
    var input = transaction.inputs[0];

    input.isFullySigned().should.equal(false);
    transaction.sign(privateKey);
    input.isFullySigned().should.equal(true);
  });
  it('it\'s size can be estimated', function() {
    var transaction = new Transaction()
      .from(output)
      .to(address, 1000000);
    var input = transaction.inputs[0];
    input._estimateSize().should.equal(107);
  });
  it('it\'s signature can be removed', function() {
    var transaction = new Transaction()
      .from(output)
      .to(address, 1000000);
    var input = transaction.inputs[0];

    transaction.sign(privateKey);
    input.clearSignatures();
    input.isFullySigned().should.equal(false);
  });
  it('returns an empty array if private key mismatches', function() {
    var transaction = new Transaction()
      .from(output)
      .to(address, 1000000);
    var input = transaction.inputs[0];
    var signatures = input.getSignatures(transaction, new PrivateKey(), 0);
    signatures.length.should.equal(0);
  });
});
