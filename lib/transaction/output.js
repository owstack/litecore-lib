'use strict';

var owsCommon = require('@owstack/ows-common');
var BN = owsCommon.BN;
var Buffer = owsCommon.deps.Buffer;
var BufferUtil = owsCommon.buffer;
var BufferWriter = owsCommon.encoding.BufferWriter;
var errors = owsCommon.errors;
var JSUtil = owsCommon.util.js;
var Script = require('../script');
var lodash = owsCommon.deps.lodash;
var $ = owsCommon.util.preconditions;

var MAX_SAFE_INTEGER = 0x1fffffffffffff;

function Output(args) {
  if (!(this instanceof Output)) {
    return new Output(args);
  }
  if (lodash.isObject(args)) {
    this.litoshis = args.litoshis;
    if (bufferUtil.isBuffer(args.script)) {
      this._scriptBuffer = args.script;
    } else {
      var script;
      if (lodash.isString(args.script) && JSUtil.isHexa(args.script)) {
        script = new buffer.Buffer(args.script, 'hex');
      } else {
        script = args.script;
      }
      this.setScript(script);
    }
  } else {
    throw new TypeError('Unrecognized argument for Output');
  }
}

Object.defineProperty(Output.prototype, 'script', {
  configurable: false,
  enumerable: true,
  get: function() {
    if (this._script) {
      return this._script;
    } else {
      this.setScriptFromBuffer(this._scriptBuffer);
      return this._script;
    }

  }
});

Object.defineProperty(Output.prototype, 'litoshis', {
  configurable: false,
  enumerable: true,
  get: function() {
    return this._litoshis;
  },
  set: function(num) {
    if (num instanceof BN) {
      this._litoshisBN = num;
      this._litoshis = num.toNumber();
    } else if (lodash.isString(num)) {
      this._litoshis = parseInt(num);
      this._litoshisBN = BN.fromNumber(this._litoshis);
    } else {
      $.checkArgument(
        JSUtil.isNaturalNumber(num),
        'Output litoshis is not a natural number'
      );
      this._litoshisBN = BN.fromNumber(num);
      this._litoshis = num;
    }
    $.checkState(
      JSUtil.isNaturalNumber(this._litoshis),
      'Output litoshis is not a natural number'
    );
  }
});

Output.prototype.invalidLitoshis = function() {
  if (this._litoshis > MAX_SAFE_INTEGER) {
    return 'transaction txout litoshis greater than max safe integer';
  }
  if (this._litoshis !== this._litoshisBN.toNumber()) {
    return 'transaction txout litoshis has corrupted value';
  }
  if (this._litoshis < 0) {
    return 'transaction txout negative';
  }
  return false;
};

Output.prototype.toObject = Output.prototype.toJSON = function toObject() {
  var obj = {
    litoshis: this.litoshis
  };
  obj.script = this._scriptBuffer.toString('hex');
  return obj;
};

Output.fromObject = function(data) {
  return new Output(data);
};

Output.prototype.setScriptFromBuffer = function(buffer) {
  this._scriptBuffer = buffer;
  try {
    this._script = Script.fromBuffer(this._scriptBuffer);
    this._script._isOutput = true;
  } catch(e) {
    if (e instanceof errors.Script.InvalidBuffer) {
      this._script = null;
    } else {
      throw e;
    }
  }
};

Output.prototype.setScript = function(script) {
  if (script instanceof Script) {
    this._scriptBuffer = script.toBuffer();
    this._script = script;
    this._script._isOutput = true;
  } else if (lodash.isString(script)) {
    this._script = Script.fromString(script);
    this._scriptBuffer = this._script.toBuffer();
    this._script._isOutput = true;
  } else if (bufferUtil.isBuffer(script)) {
    this.setScriptFromBuffer(script);
  } else {
    throw new TypeError('Invalid argument type: script');
  }
  return this;
};

Output.prototype.inspect = function() {
  var scriptStr;
  if (this.script) {
    scriptStr = this.script.inspect();
  } else {
    scriptStr = this._scriptBuffer.toString('hex');
  }
  return '<Output (' + this.litoshis + ' sats) ' + scriptStr + '>';
};

Output.fromBufferReader = function(br) {
  var obj = {};
  obj.litoshis = br.readUInt64LEBN();
  var size = br.readVarintNum();
  if (size !== 0) {
    obj.script = br.read(size);
  } else {
    obj.script = new buffer.Buffer([]);
  }
  return new Output(obj);
};

Output.prototype.toBufferWriter = function(writer) {
  if (!writer) {
    writer = new BufferWriter();
  }
  writer.writeUInt64LEBN(this._litoshisBN);
  var script = this._scriptBuffer;
  writer.writeVarintNum(script.length);
  writer.write(script);
  return writer;
};

module.exports = Output;
