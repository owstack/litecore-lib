Ltc Lib
=======

[![NPM Package](https://img.shields.io/npm/v/@owstack/ltc-lib.svg?style=flat-square)](https://www.npmjs.org/package/@owstack/ltc-lib)
[![Build Status](https://img.shields.io/travis/owstack/ltc-lib.svg?branch=master&style=flat-square)](https://travis-ci.org/owstack/ltc-lib)
[![Coverage Status](https://img.shields.io/coveralls/owstack/ltc-lib.svg?style=flat-square)](https://coveralls.io/r/owstack/ltc-lib)


A pure and powerful JavaScript Litecoin library.

## Principles

Litecoin is a powerful new peer-to-peer platform for the next generation of financial technology. The decentralized nature of the Litecoin network allows for highly resilient litecoin infrastructure, and the developer community needs reliable, open-source tools to implement litecoin apps and services.

## Get Started

```
npm install @owstack/ltc-lib
```

## Examples

* [Generate a random address](https://github.com/owstack/ltc-lib/blob/master/docs/examples.md#generate-a-random-address)
* [Generate a address from a SHA256 hash](https://github.com/owstack/ltc-lib/blob/master/docs/examples.md#generate-a-address-from-a-sha256-hash)
* [Import an address via WIF](https://github.com/owstack/ltc-lib/blob/master/docs/examples.md#import-an-address-via-wif)
* [Create a Transaction](https://github.com/owstack/ltc-lib/blob/master/docs/examples.md#create-a-transaction)
* [Sign a Bitcoin message](https://github.com/owstack/ltc-lib/blob/master/docs/examples.md#sign-a-bitcoin-message)
* [Verify a Bitcoin message](https://github.com/owstack/ltc-lib/blob/master/docs/examples.md#verify-a-bitcoin-message)
* [Create an OP RETURN transaction](https://github.com/owstack/ltc-lib/blob/master/docs/examples.md#create-an-op-return-transaction)
* [Create a 2-of-3 multisig P2SH address](https://github.com/owstack/ltc-lib/blob/master/docs/examples.md#create-a-2-of-3-multisig-p2sh-address)
* [Spend from a 2-of-2 multisig P2SH address](https://github.com/owstack/ltc-lib/blob/master/docs/examples.md#spend-from-a-2-of-2-multisig-p2sh-address)


## Security

We're using ltc-lib in production, as are [many others](http://ltc-lib.io#projects), but please use common sense when doing anything related to finances! We take no responsibility for your implementation decisions.

If you find a security issue, please email security@openwalletstack.com.

## Contributing

Please send pull requests for bug fixes, code optimization, and ideas for improvement. For more information on how to contribute, please refer to our [CONTRIBUTING](https://github.com/owstack/ltc-lib/blob/master/CONTRIBUTING.md) file.

## Building the Browser Bundle

To build a ltc-lib full bundle for the browser:

```sh
gulp browser
```

This will generate files named `ltc-lib.js` and `ltc-lib.min.js`.

## Development & Tests

```sh
git clone https://github.com/owstack/ltc-lib
cd ltc-lib
npm install
```

Run all the tests:

```sh
gulp test
```

You can also run just the Node.js tests with `gulp test:node`, just the browser tests with `gulp test:browser`
or create a test coverage report (you can open `coverage/lcov-report/index.html` to visualize it) with `gulp coverage`.

## License

Code released under [the MIT license](https://github.com/owstack/ltc-lib/blob/master/LICENSE).

Copyright 2013-2015 BitPay, Inc. Bitcore is a trademark maintained by BitPay, Inc.
Copyright 2016 The Litecoin Core Developers
