'use strict';

var chai = require('chai');
var should = chai.should();

var owsCommon = require('@owstack/ows-common');
var ltcLib = require('../../');
var Buffer = owsCommon.deps.Buffer;
var Script = ltcLib.Script;
var Transaction = ltcLib.Transaction;
var sighash = Transaction.sighash;
var vectors_sighash = require('../data/sighash.json');

describe('sighash', function() {

  vectors_sighash.forEach(function(vector, i) {
    if (i === 0) {
      // First element is just a row describing the next ones
      return;
    }
    it('test vector from litecoind #' + i + ' (' + vector[4].substring(0, 16) + ')', function() {
      var txbuf = new Buffer(vector[0], 'hex');
      var scriptbuf = new Buffer(vector[1], 'hex');
      var subscript = Script(scriptbuf);
      var nin = vector[2];
      var nhashtype = vector[3];
      var sighashbuf = new Buffer(vector[4], 'hex');
      var tx = new Transaction(txbuf);

      //make sure transacion to/from buffer is isomorphic
      tx.uncheckedSerialize().should.equal(txbuf.toString('hex'));

      //sighash ought to be correct
      sighash.sighash(tx, nhashtype, nin, subscript).toString('hex').should.equal(sighashbuf.toString('hex'));
    });
  });
});
