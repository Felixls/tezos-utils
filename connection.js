module.exports = function (RED) {
  function TezosConnectionConfigNode(n) {
    RED.nodes.createNode(this, n);
    this.name = n.name;
    this.rpc = n.rpc;
    this.network = n.network;
  }
  RED.nodes.registerType('connection', TezosConnectionConfigNode);
};
