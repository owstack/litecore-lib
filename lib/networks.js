'use strict';

var Networks = require('@owstack/network-lib');
var Bip44 = Networks.Bip44;

var coin = 'LTC';
var preference = 'LTC';
var regtestEnabled = false;

/**
 * For object definition see https://github.com/owstack/key-lib/blob/master/lib/networks.js
 */
var networks = [{
  name: 'Litecoin',
  code: 'LTC',
  coin: Bip44['LTC'] ^ 0x80000000,
  protocol: 'litecoin',
  alias: 'livenet',
  preference: preference,
  prefix: {
    pubkeyhash: 0x30,
    privatekey: 0xb0,
    scripthash: 0x32
  },
  version: {
    xpubkey: 0x019da462,
    xprivkey: 0x019d9cfe,
  },
  networkMagic: 0xfbc0b6db,
  port: 9333,
  dnsSeeds: [
    'dnsseed.litecointools.com',
    'dnsseed.litecoinpool.org',
    'dnsseed.ltc.xurious.com',
    'dnsseed.koin-project.com',
    'seed-a.litecoin.loshan.co.uk',
    'dnsseed.thrasher.io'
  ]
}, {
  name: 'Testnet',
  code: 'TESTNET',
  coin: Bip44['TESTNET'] ^ 0x80000000,
  protocol: 'testnet',
  alias: 'testnet',
  preference: preference,
  prefix: {
    pubkeyhash: 0x6f,
    privatekey: 0xef,
    scripthash: 0x3a
  },
  version: {
    xpubkey: 0x043587cf,
    xprivkey: 0x04358394
  },
  networkMagic: 0x0b110907,
  port: 18333,
  dnsSeeds: [
    'dnsseed.litecointools.com',
    'dnsseed.litecoinpool.org',
    'dnsseed.ltc.xurious.com',
    'dnsseed.koin-project.com',
    'seed-a.litecoin.loshan.co.uk',
    'dnsseed.thrasher.io'
  ]
}, {
  name: 'Regtest',
  code: 'REGTEST',
  coin: Bip44['TESTNET'] ^ 0x80000000,
  protocol: 'regtest',
  alias: 'testnet',
  preference: preference,
  prefix: {
    pubkeyhash: 0x6f,
    privatekey: 0xef,
    scripthash: 0x3a
  },
  version: {
    xpubkey: 0x043587cf,
    xprivkey: 0x04358394
  },
  networkMagic: 0xdab5bffa,
  port: 18444,
  dnsSeeds: [
    'dnsseed.litecointools.com',
    'dnsseed.litecoinpool.org',
    'dnsseed.ltc.xurious.com',
    'dnsseed.koin-project.com',
    'seed-a.litecoin.loshan.co.uk',
    'dnsseed.thrasher.io'
  ],
  indexBy: Networks.indexMinimal
}];

Networks.add(networks);

/**
 * @constructor
 */
function LtcNetworks() {}

/**
 * @function
 * @member LtcNetworks#get
 * Retrieves the network associated.
 * @param {string|number|Network} arg
 * @param {string|Array} keys - if set, only check if the keys associated with this name match
 * @return Network
 */
LtcNetworks.get = function(arg, keys) {
  var network;

  if (typeof(arg) === 'string') {
    arg = arg.trim();

    switch (arg) {
      case 'livenet':
      case 'mainnet':
        network = Networks.get('LTC', keys, preference);
        break;

      case 'testnet':
        if (regtestEnabled) {
          network = Networks.get('REGTEST', keys, preference);
        } else {
          network = Networks.get('TESTNET', keys, preference);
        }
        break;

      case 'regtest':
        network = Networks.get('REGTEST', keys, preference);
        break;
    }
  }

  if (!network) {
    // Prefer this network (third arg).
    network = Networks.get(arg, keys, preference);
  }

  return network;
};

/**
 * @function
 * @member Networks#getProtcols
 * Returns an array of protocols names
 */
LtcNetworks.getProtocols = function() {
  var protocols = [];
  for (var i = 0; i < networks.length; i++) {
    if (networks[i].protocol) {
      protocols.push(networks[i].protocol);
    }
  }
  return protocols;
};

/**
 * @function
 * @member Networks#getLivenetProtcol
 * Returns the livenet protocol
 */
LtcNetworks.getLivenetProtocol = function() {
  for (var i = 0; i < networks.length; i++) {
    if (networks[i].alias == 'livenet') {
      return networks[i].protocol;
    }
  }
  throw new Error('No livenet protocol found');
};

/**
 * @function
 * Will enable regtest features for testnet
 */
LtcNetworks.enableRegtest = function() {
  regtestEnabled = true;
};

/**
 * @function
 * Will disable regtest features for testnet
 */
LtcNetworks.disableRegtest = function() {
  regtestEnabled = false;
};

/**
 * @namespace LtcNetworks
 */
module.exports = {
  add: Networks.add,
  remove: Networks.remove,
  get: LtcNetworks.get,
  getProtocols: LtcNetworks.getProtocols,
  getProtocol: LtcNetworks.getLivenetProtocol,
  enableRegtest: LtcNetworks.enableRegtest,
  disableRegtest: LtcNetworks.disableRegtest,
  defaultNetwork: LtcNetworks.get('LTC'),
  livenet: LtcNetworks.get('LTC'),
  mainnet: LtcNetworks.get('LTC'),
  testnet: LtcNetworks.get('TESTNET'),
  regtest: LtcNetworks.get('REGTEST'),
  coin: coin
};
