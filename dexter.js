module.exports = function (RED) {
  'use strict';

  function Dexter(config) {
    RED.nodes.createNode(this, config);
    this.walletConfig = RED.nodes.getNode(config.wallet);
    this.tezosNode = RED.nodes.getNode(config.rpc);
    this.operation = config.operation;
    this.token = config.token;
    var node = this;
    node.on('input', async function (msg, send, done) {
      send =
        send ||
        function () {
          node.send.apply(node, arguments);
        };

      if (typeof msg.payload !== 'object') {
        msg.payload = {};
      }

      const sk = node.walletConfig.credentials.secretKey;
      const address = node.walletConfig.address;

      const taquito = require('@taquito/taquito');
      const token = require('dexterlib/dist/token');
      const bignumber = require('bignumber.js');

      const minimumTokenOutput = bignumber.BigNumber(
        msg.payload.minimumTokenOutput
      );
      const minimumXtzOutput = bignumber.BigNumber(
        msg.payload.minimumXtzOutput
      );

      const amount = msg.payload.amount;

      const tezos = new taquito.TezosToolkit(node.tezosNode.rpc);
      const kUSD = new token.kUSD(tezos, sk);
      const usdTZ = new token.UsdTZ(tezos, sk);
      const ETHtz = new token.ETHtz(tezos, sk);
      const tzBTC = new token.TzBTC(tezos, sk);
      const XTZ = new token.XTZ(tezos);

      try {
        switch (node.operation) {
          case 'getPool':
            msg.payload.xtzPool = +(await usdTZ.getXTZPool());
            switch (node.token) {
              case 'kUSD':
                msg.payload.tokenPool = +(await kUSD.getTokenPool());
                break;
              case 'USDtz':
                msg.payload.tokenPool = +(await usdTZ.getTokenPool());
                break;
              case 'tzBTC':
                msg.payload.tokenPool = +(await tzBTC.getTokenPool());
                break;
              case 'ETHtz':
                msg.payload.tokenPool = +(await ETHtz.getTokenPool());
                break;
              case 'XTZ':
                break;
            }
            break;
          case 'getBalance':
            switch (node.token) {
              case 'kUSD':
                msg.payload.tokenBalance = +(await kUSD.getBalance(address));
                break;
              case 'USDtz':
                msg.payload.tokenBalance = +(await usdTZ.getBalance(address));
                break;
              case 'tzBTC':
                msg.payload.tokenBalance = +(await tzBTC.getBalance(address));
                break;
              case 'ETHtz':
                msg.payload.tokenBalance = +(await ETHtz.getBalance(address));
                break;
              case 'XTZ':
                msg.payload.tokenBalance = +(await XTZ.getBalance(address));
                break;
            }
            break;
          case 'xtzToToken':
            switch (node.token) {
              case 'kUSD':
                msg.payload.opHash = await kUSD.fromXTZ(
                  address,
                  minimumTokenOutput.toNumber(),
                  amount
                );
                break;
              case 'USDtz':
                msg.payload.opHash = await usdTZ.fromXTZ(
                  address,
                  minimumTokenOutput.toNumber(),
                  amount
                );
                break;
              case 'tzBTC':
                msg.payload.opHash = await tzBTC.fromXTZ(
                  address,
                  minimumTokenOutput.toNumber(),
                  amount
                );
                break;
              case 'ETHtz':
                msg.payload.opHash = await ETHtz.fromXTZ(
                  address,
                  minimumTokenOutput.toNumber(),
                  amount
                );
                break;
            }
            break;
          case 'tokenToXtz':
            switch (node.token) {
              case 'kUSD':
                msg.payload.opHash = await kUSD.toXTZ(
                  address,
                  minimumXtzOutput.toNumber(),
                  amount
                );
                break;
              case 'USDtz':
                msg.payload.opHash = await usdTZ.toXTZ(
                  address,
                  minimumXtzOutput.toNumber(),
                  amount
                );
                break;
              case 'tzBTC':
                msg.payload.opHash = await tzBTC.toXTZ(
                  address,
                  minimumXtzOutput.toNumber(),
                  amount
                );
                break;
            }
            break;
          default:
            break;
        }
      } catch (err) {
        msg.payload.error = err;
      }

      send(msg);

      if (done) {
        done();
      }
    });
  }
  RED.nodes.registerType('dexter', Dexter);
};
