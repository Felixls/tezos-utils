module.exports = function (RED) {
  'use strict';

  function Harbinger(config) {
    RED.nodes.createNode(this, config);
    this.tezosNode = RED.nodes.getNode(config.rpc);
    this.pair = config.pair;
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

      const taquito = require('@taquito/taquito');
      const harbinger = require('dexterlib/dist/harbinger');

      const tezos = new taquito.TezosToolkit(node.tezosNode.rpc);
      const hb = new harbinger.Harbinger(tezos);

      try {
        const price = await hb.getPrice(node.pair);
        msg.payload.marketPrice = price.div(10 ** 6).toNumber();
      } catch (err) {
        msg.payload.error = err;
      }

      send(msg);

      if (done) {
        done();
      }
    });
  }
  RED.nodes.registerType('harbinger', Harbinger);
};
