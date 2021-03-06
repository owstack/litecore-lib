'use strict';

var ltcLib = require('../');
var Networks = require('@owstack/network-lib');
var Bip44 = Networks.Bip44;

var currency = 'LTC';
var regtestEnabled = false;

/**
 * For object definition see https://github.com/owstack/key-lib/blob/master/lib/networks.js
 */
 
var networks = [{
  lib: ltcLib,
  currency: currency,
  description: 'Litecoin',
  name: 'ltc',
  alias: 'livenet',
  coinIndex: Bip44['LTC'] ^ 0x80000000,
  protocol: 'litecoin',
  prefix: {
    pubkeyhash: 0x30,
    privatekey: 0xb0,
    scripthash: 0x32
  },
  version: { // see SLIP132
    xpubkey: {
      bytes: 0x019da462,
      text: 'Ltub'
    },
    xprivkey: {
      bytes: 0x019d9cfe,
      text: 'Ltpv'
    }
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
  lib: ltcLib,
  currency: currency,
  description: 'Testnet',
  name: 'ltctest',
  alias: 'testnet',
  coinIndex: Bip44['TESTNET'] ^ 0x80000000,
  protocol: 'ltctest',
  prefix: {
    pubkeyhash: 0x6f,
    privatekey: 0xef,
    scripthash: 0x3a
  },
  version: { // see SLIP132
    xpubkey: {
      bytes: 0x0436f6e1,
      text: 'ttub'
    },
    xprivkey: {
      bytes: 0x0436ef7d,
      text: 'ttpv'
    }
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
  lib: ltcLib,
  currency: currency,
  description: 'Regtest',
  name: 'ltcreg',
  alias: 'testnet',
  coinIndex: Bip44['TESTNET'] ^ 0x80000000,
  protocol: 'ltcreg',
  prefix: {
    pubkeyhash: 0x6f,
    privatekey: 0xef,
    scripthash: 0x3a
  },
  version: { // see SLIP132
    xpubkey: {
      bytes: 0x0436f6e1,
      text: 'ttub'
    },
    xprivkey: {
      bytes: 0x0436ef7d,
      text: 'ttpv'
    }
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
        network = Networks.get('ltc', keys, currency);
        break;

      case 'testnet':
        if (regtestEnabled) {
          network = Networks.get('ltcreg', keys, currency);
        } else {
          network = Networks.get('ltctest', keys, currency);
        }
        break;

      case 'regtest':
        network = Networks.get('ltcreg', keys, currency);
        break;
    }
  }

  if (!network) {
    network = Networks.get(arg, keys, currency);
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
  currency: currency,
  enableRegtest: LtcNetworks.enableRegtest,
  disableRegtest: LtcNetworks.disableRegtest,
  defaultNetwork: LtcNetworks.get('ltc'),
  livenet: LtcNetworks.get('ltc'),
  mainnet: LtcNetworks.get('ltc'),
  testnet: LtcNetworks.get('ltctest'),
  regtest: LtcNetworks.get('ltcreg')
};
