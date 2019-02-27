'use strict';

var ltcLib = {};

// Module information
ltcLib.version = 'v' + require('./package.json').version;

// Main litecoin library
ltcLib.Address = require('./lib/address');
ltcLib.Block = require('./lib/block');
ltcLib.Defaults = require('./lib/common/defaults');
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

// Inject this library into each of its networks as network.lib.
var ltcNetworks = require('@owstack/network-lib').getFiltered({currency: ltcLib.Networks.currency});
for (var i = 0; i < ltcNetworks.length; i++) {
	ltcNetworks[i].lib = ltcLib;
}

module.exports = ltcLib;
