#!/usr/bin/env node

var Transaction = require('../src/js/ripple/transaction').Transaction;

var argv = process.argv.slice(2);

var verbose;
var tx_json;

if (~argv.indexOf('-v')){
  argv.splice(argv.indexOf('-v'), 1);
  verbose = true;
}

tx_json = argv.shift();

if (tx_json === '-') {
  read_input(ready);
} else {
  ready();
}

function read_input(callback) {
  tx_json = '';
  process.stdin.on('data', function(data) { tx_json += data; });
  process.stdin.on('end', callback);
  process.stdin.resume();
}

function ready() {
  var valid_arguments = tx_json;

  if (!valid_arguments) {
    console.error('Invalid arguments\n');
    print_usage();
  } else {
    var valid_json = true;

    try {
      tx_json = JSON.parse(tx_json);
    } catch(exception) {
      valid_json = false;
    }

    if (!valid_json) {
      console.error('Invalid JSON\n');
      print_usage();
    } else {
      sign_transaction();
    }
  }
}

function print_usage() {
  console.log(
    'Usage: encode.js <json>\n\n',
    'Example: encode.js ','\''+
    JSON.stringify({
      TransactionType: 'Payment',
      Account: 'r3P9vH81KBayazSTrQj6S25jW6kDb779Gi',
      Destination: 'r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV',
      Amount: '200000000',
      Fee: '10',
      Sequence: 1
    })+'\''
    );
};

function sign_transaction() {
  var tx = new Transaction();

  tx.tx_json = tx_json;
  tx.complete();

  var unsigned_blob = tx.serialize().to_hex();
  var unsigned_hash = tx.signingHash();

  if (verbose) {
    var sim = { };

    sim.tx_blob         = tx.serialize().to_hex();
    sim.tx_json         = tx.tx_json;
    sim.tx_signing_hash = unsigned_hash;
    sim.tx_unsigned     = unsigned_blob;

    console.log(JSON.stringify(sim, null, 2));
  } else {
    console.log(tx.serialize().to_hex());
  }
};

// vim:sw=2:sts=2:ts=8:et
