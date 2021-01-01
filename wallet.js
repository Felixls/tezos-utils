module.exports = function (RED) {
  function TezosWalletConfigNode(n) {
    RED.nodes.createNode(this, n);
    this.name = n.name;
    this.address = n.address;
  }
  RED.nodes.registerType('wallet', TezosWalletConfigNode, {
    credentials: {
      secretKey: { type: 'password' },
    },
  });
};
