'use strict';

var ltcLib = {};

// Module information
ltcLib.version = 'v' + require('./package.json').version;

// Main litecoin library
ltcLib.Address = require('./lib/address');
ltcLib.Block = require('./lib/block');
ltcLib.MerkleBlock = require('./lib/block/merkleblock');
ltcLib.BlockHeader = require('./lib/block/blockheader');
ltcLib.Networks = require('./lib/networks');
ltcLib.Opcode = require('./lib/opcode');
ltcLib.Script = require('./lib/script');
ltcLib.Transaction = require('./lib/transaction');
ltcLib.URI = require('./lib/uri');
ltcLib.Unit = require('./lib/unit');

// Internal usage, exposed for testing/advanced tweaking
ltcLib.Transaction.sighash = require('./lib/transaction/sighash');

module.exports = ltcLib;
