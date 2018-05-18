'use strict';

var ltcLib = module.exports;

// module information
ltcLib.version = 'v' + require('./package.json').version;

// crypto
ltcLib.crypto = {};
ltcLib.crypto.BN = require('./lib/crypto/bn');
ltcLib.crypto.ECDSA = require('./lib/crypto/ecdsa');
ltcLib.crypto.Hash = require('./lib/crypto/hash');
ltcLib.crypto.Random = require('./lib/crypto/random');
ltcLib.crypto.Point = require('./lib/crypto/point');
ltcLib.crypto.Signature = require('./lib/crypto/signature');

// encoding
ltcLib.encoding = {};
ltcLib.encoding.Base58 = require('./lib/encoding/base58');
ltcLib.encoding.Base58Check = require('./lib/encoding/base58check');
ltcLib.encoding.BufferReader = require('./lib/encoding/bufferreader');
ltcLib.encoding.BufferWriter = require('./lib/encoding/bufferwriter');
ltcLib.encoding.Varint = require('./lib/encoding/varint');

// utilities
ltcLib.util = {};
ltcLib.util.buffer = require('./lib/util/buffer');
ltcLib.util.js = require('./lib/util/js');
ltcLib.util.preconditions = require('./lib/util/preconditions');

// errors thrown by the library
ltcLib.errors = require('./lib/errors');

// main bitcoin library
ltcLib.Address = require('./lib/address');
ltcLib.Block = require('./lib/block');
ltcLib.MerkleBlock = require('./lib/block/merkleblock');
ltcLib.BlockHeader = require('./lib/block/blockheader');
ltcLib.HDPrivateKey = require('./lib/hdprivatekey.js');
ltcLib.HDPublicKey = require('./lib/hdpublickey.js');
ltcLib.Networks = require('./lib/networks');
ltcLib.Opcode = require('./lib/opcode');
ltcLib.PrivateKey = require('./lib/privatekey');
ltcLib.PublicKey = require('./lib/publickey');
ltcLib.Script = require('./lib/script');
ltcLib.Transaction = require('./lib/transaction');
ltcLib.URI = require('./lib/uri');
ltcLib.Unit = require('./lib/unit');

// dependencies, subject to change
ltcLib.deps = {};
ltcLib.deps.bnjs = require('bn.js');
ltcLib.deps.bs58 = require('bs58');
ltcLib.deps.Buffer = Buffer;
ltcLib.deps.elliptic = require('elliptic');
ltcLib.deps.scryptsy = require('scryptsy');
ltcLib.deps._ = require('lodash');

// Internal usage, exposed for testing/advanced tweaking

ltcLib.Transaction.sighash = require('./lib/transaction/sighash');
