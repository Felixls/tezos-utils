module.exports = function (RED) {
  'use strict';

  function Kolibri(config) {
    RED.nodes.createNode(this, config);
    this.walletConfig = RED.nodes.getNode(config.wallet);
    this.tezosNode = RED.nodes.getNode(config.rpc);
    this.operation = config.operation;
    this.ovenAddress = config.oven;
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

      const kolibri = require('@hover-labs/kolibri-js');
      const taquitoSigner = require('@taquito/signer');
      const bignumber = require('bignumber.js');
      const taquito = require('@taquito/taquito');

      const network = kolibri.Network[this.tezosNode.network.toLowerCase()];

      const signer = await taquitoSigner.InMemorySigner.fromSecretKey(sk);

      const tezos = new taquito.TezosToolkit(node.tezosNode.rpc);
      tezos.setSignerProvider(signer);
      const ovenContract = await tezos.wallet.at(node.ovenAddress);

      const harbingerClient = new kolibri.HarbingerClient(
        node.tezosNode.rpc,
        network === kolibri.Network.Mainnet
          ? kolibri.CONTRACTS.MAIN.HARBINGER_NORMALIZER
          : kolibri.CONTRACTS.DELPHI.HARBINGER_NORMALIZER
      );

      const stableCoinClient = new kolibri.StableCoinClient(
        node.tezosNode.rpc,
        network,
        network === kolibri.Network.Mainnet
          ? kolibri.CONTRACTS.MAIN.OVEN_REGISTRY
          : kolibri.CONTRACTS.DELPHI.OVEN_REGISTRY,
        network === kolibri.Network.Mainnet
          ? kolibri.CONTRACTS.MAIN.MINTER
          : kolibri.CONTRACTS.DELPHI.MINTER,
        network === kolibri.Network.Mainnet
          ? kolibri.CONTRACTS.MAIN.OVEN_FACTORY
          : kolibri.CONTRACTS.DELPHI.OVEN_FACTORY
      );

      const ovenClient = new kolibri.OvenClient(
        node.tezosNode.rpc,
        signer,
        node.ovenAddress,
        stableCoinClient,
        harbingerClient
      );

      try {
        switch (node.operation) {
          case 'getCollateralizationRatio':
            msg.payload.collateralizationRatio = await ovenClient.getCollateralizationRatio();
            break;
          case 'getBorrowedTokens':
            msg.payload.borrowedTokens = await ovenClient.getBorrowedTokens();
            break;
          case 'getTotalOutstandingTokens':
            msg.payload.totalOutstandingTokens = await ovenClient.getTotalOutstandingTokens();
            break;
          case 'getStabilityFees':
            msg.payload.stabilityFees = await ovenClient.getStabilityFees();
            break;
          case 'isLiquidated':
            msg.payload.isLiquidated = await ovenClient.isLiquidated();
            break;
          case 'getBalance':
            msg.payload.balance = await ovenClient.getBalance();
            break;
          case 'liquidate':
            msg.payload.opHash = await ovenContract.methods
              .liquidate([['unit']])
              .send({ amount: 0, mutez: true });
            break;
          case 'borrow':
            msg.payload.opHash = await ovenContract.methods
              .borrow(bignumber.BigNumber(msg.payload.tokens))
              .send({ amount: 0, mutez: true });
            break;
          case 'deposit':
            msg.payload.opHash = await ovenContract.methods
              .default([['unit']])
              .send({
                amount: bignumber.BigNumber(msg.payload.mutez),
                mutez: true,
              });
            break;
          case 'withdraw':
            msg.payload.opHash = await ovenContract.methods
              .withdraw(bignumber.BigNumber(msg.payload.mutez))
              .send({ amount: 0, mutez: true });
            break;
          case 'repay':
            msg.payload.opHash = await ovenContract.methods
              .withdraw(bignumber.BigNumber(msg.payload.tokens))
              .send({ amount: 0, mutez: true });
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
  RED.nodes.registerType('kolibri', Kolibri);
};
