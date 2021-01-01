module.exports = function (RED) {
  function TezosConnectionConfigNode(n) {
    RED.nodes.createNode(this, n);
    this.name = n.name;
    this.rpc = n.rpc;
  }
  RED.nodes.registerType('connection', TezosConnectionConfigNode);
};
