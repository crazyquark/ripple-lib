'use strict';
exports.Remote = require('./remote').Remote;
exports.Request = require('./request').Request;
exports.Amount = require('./amount').Amount;
exports.Account = require('./account').Account;
exports.Transaction = require('./transaction').Transaction;
exports.Currency = require('./currency').Currency;
exports.Base = require('./base').Base;
exports.UInt128 = require('./uint128').UInt128;
exports.UInt160 = require('./uint160').UInt160;
exports.UInt256 = require('./uint256').UInt256;
exports.Seed = require('./seed').Seed;
exports.Meta = require('./meta').Meta;
exports.SerializedObject = require('./serializedobject').SerializedObject;
exports.RippleError = require('./rippleerror').RippleError;
exports.binformat = require('./binformat');
exports.utils = require('./utils');
exports.Server = require('./server').Server;
exports.Ledger = require('./ledger').Ledger;
exports.TransactionQueue = require('./transactionqueue').TransactionQueue;
exports.RangeSet = require('./rangeset').RangeSet;
exports.convertBase = require('./baseconverter');

exports.keypairs = require('./keypairs');
exports.getKeyPair = exports.keypairs.getKeyPair;

exports._test = {
  Log: require('./log'),
  PathFind: require('./pathfind').PathFind,
  TransactionManager: require('./transactionmanager').TransactionManager
};

exports.types = require('./serializedtypes');

// camelCase to under_scored API conversion
function attachUnderscored(name) {
  const o = exports[name];

  Object.keys(o.prototype).forEach(function(key) {
    const UPPERCASE = /([A-Z]{1})[a-z]+/g;

    if (!UPPERCASE.test(key)) {
      return;
    }

    const underscored = key.replace(UPPERCASE, function(c) {
      return '_' + c.toLowerCase();
    });

    o.prototype[underscored] = o.prototype[key];
  });
}

['Remote',
 'Request',
 'Transaction',
 'Account',
 'Server'
].forEach(attachUnderscored);

// vim:sw=2:sts=2:ts=8:et
