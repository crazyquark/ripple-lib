#!/usr/bin/env node

var Transaction = require('../src/js/ripple/transaction').Transaction;

var argv = process.argv.slice(2);

var verbose;
var tx_json;
var pub_key;
var signed_hash;

if (~argv.indexOf('-v')){
  argv.splice(argv.indexOf('-v'), 1);
  verbose = true;
}

pub_key = argv.shift();
tx_json = argv.shift();
signed_hash = argv.shift();

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
  var valid_arguments = tx_json && pub_key;

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
    'Usage: encode.js <pubkey_hex> <json> [signed_hash_hex]\n\n',
    'Example: encode.js 04CB30ACE4D5690F97B04E82DD25F658517CFBD98DD9F9E639CEE41DEDE5BC787E3FA79A5BF5D39E07FC7C84215D609CCB69D4F4B86FB83494EB3A37','\''+
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
  
  // Hack: manually add public key
  tx.tx_json.SigningPubKey = pub_key;
  
  var unsigned_blob = tx.serialize().to_hex();
  var unsigned_hash = tx.signingHash();

  // Hack(again): manually add transaction signature
  if (signed_hash) {
    tx.tx_json.TxnSignature = signed_hash
  }
  
  if (verbose) {
    var sim = { };

    sim.tx_blob         = tx.serialize().to_hex();
    sim.tx_json         = tx.tx_json;
    sim.tx_signing_hash = unsigned_hash;
    sim.tx_unsigned     = unsigned_blob;
    //sim.signing_data    = tx.signingData();

    console.log(JSON.stringify(sim, null, 2));
  } else {
    console.log(tx.serialize().to_hex());
  }
};

// vim:sw=2:sts=2:ts=8:et
