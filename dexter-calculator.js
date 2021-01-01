module.exports = function (RED) {
  'use strict';

  function DexterCalculator(config) {
    const dc = require('dexter-calculations');
    RED.nodes.createNode(this, config);
    this.operation = config.operation;
    var node = this;
    node.on('input', function (msg, send, done) {
      send =
        send ||
        function () {
          node.send.apply(node, arguments);
        };

      if (typeof msg.payload !== 'object') {
        msg.payload = {};
      }

      switch (node.operation) {
        //
        // XTZ to Token functions
        //
        case 'xtzToTokenTokenOutput':
          msg.payload.tokenOut = +dc.xtzToTokenTokenOutput(
            msg.payload.xtzIn,
            msg.payload.xtzPool,
            msg.payload.tokenPool
          );
          send(msg);
          break;
        case 'xtzToTokenXtzInput':
          msg.payload.xtzIn = +dc.xtzToTokenXtzInput(
            msg.payload.tokenOut,
            msg.payload.xtzPool,
            msg.payload.tokenPool,
            msg.payload.decimals
          );
          send(msg);
          break;
        case 'xtzToTokenExchangeRate':
          msg.payload.xtzToTokenExchangeRate = +dc.xtzToTokenExchangeRate(
            msg.payload.xtzIn,
            msg.payload.xtzPool,
            msg.payload.tokenPool
          );
          send(msg);
          break;
        case 'xtzToTokenMarketRate':
          msg.payload.xtzToTokenMarketRate = +dc.xtzToTokenMarketRate(
            msg.payload.xtzPool,
            msg.payload.tokenPool
          );
          send(msg);
          break;
        case 'xtzToTokenSlippage':
          msg.payload.xtzToTokenSlippage = +dc.xtzToTokenSlippage(
            msg.payload.xtzIn,
            msg.payload.xtzPool,
            msg.payload.tokenPool
          );
          send(msg);
          break;
        case 'xtzToTokenMinimumTokenOutput':
          msg.payload.minimumTokenOutput = +dc.xtzToTokenMinimumTokenOutput(
            msg.payload.tokenOut,
            msg.payload.allowedSlippage
          );
          send(msg);
          break;
        //
        // Token to XTZ functions
        //
        case 'tokenToXtzXtzOutput':
          msg.payload.xtzOut = +dc.tokenToXtzXtzOutput(
            msg.payload.tokenIn,
            msg.payload.xtzPool,
            msg.payload.tokenPool
          );
          send(msg);
          break;
        case 'tokenToXtzTokenInput':
          msg.payload.tokenIn = +dc.tokenToXtzTokenInput(
            msg.payload.xtzOut,
            msg.payload.xtzPool,
            msg.payload.tokenPool,
            msg.payload.decimals
          );
          send(msg);
          break;
        case 'tokenToXtzExchangeRate':
          msg.payload.tokenToXtzExchangeRate = +dc.tokenToXtzExchangeRate(
            msg.payload.tokenIn,
            msg.payload.xtzPool,
            msg.payload.tokenPool
          );
          send(msg);
          break;
        case 'tokenToXtzMarketRate':
          msg.payload.tokenToXtzMarketRate = +dc.tokenToXtzMarketRate(
            msg.payload.xtzPool,
            msg.payload.tokenPool
          );
          send(msg);
          break;
        case 'tokenToXtzSlippage':
          msg.payload.tokenToXtzSlippage = +dc.tokenToXtzSlippage(
            msg.payload.tokenIn,
            msg.payload.xtzPool,
            msg.payload.tokenPool
          );
          send(msg);
          break;
        case 'tokenToXtzMinimumXtzOutput':
          msg.payload.minimumXtzOutput = +dc.tokenToXtzMinimumXtzOutput(
            msg.payload.xtzOut,
            msg.payload.allowedSlippage
          );
          send(msg);
          break;
        //
        // Liquidity fees functions
        //
        case 'totalLiquidityProviderFee':
          msg.payload.totalLiqProviderFee = +dc.totalLiquidityProviderFee(
            msg.payload.xtzIn
          );
          send(msg);
          break;
        case 'liquidityProviderFee':
          msg.payload.liqProviderFee = +dc.liquidityProviderFee(
            msg.payload.xtzIn,
            msg.payload.totalLiquidity,
            msg.payload.userLiquidity
          );
          send(msg);
          break;
        //
        // Liquidity management functions
        //
        case 'addLiquidityLiquidityCreated':
          msg.payload.liquidityCreated = +dc.addLiquidityLiquidityCreated(
            msg.payload.xtzIn,
            msg.payload.xtzPool,
            msg.payload.totalLiquidity
          );
          send(msg);
          break;
        case 'addLiquidityTokenIn':
          msg.payload.liqTokenIn = +dc.addLiquidityTokenIn(
            msg.payload.xtzIn,
            msg.payload.xtzPool,
            msg.payload.tokenPool
          );
          send(msg);
          break;
        case 'addLiquidityXtzIn':
          msg.payload.liqXtzIn = +dc.addLiquidityXtzIn(
            msg.payload.tokenIn,
            msg.payload.xtzPool,
            msg.payload.tokenPool
          );
          send(msg);
          break;
        case 'removeLiquidityTokenOut':
          msg.payload.liqTokenOut = +dc.removeLiquidityTokenOut(
            msg.payload.liquidityBurned,
            msg.payload.totalLiquidity,
            msg.payload.tokenPool
          );
          send(msg);
          break;
        case 'removeLiquidityXtzOut':
          msg.payload.liqXtzOut = +dc.removeLiquidityXtzOut(
            msg.payload.liquidityBurned,
            msg.payload.totalLiquidity,
            msg.payload.xtzPool
          );
          send(msg);
          break;

        default:
          break;
      }

      if (done) {
        done();
      }
    });
  }
  RED.nodes.registerType('dexter-calculator', DexterCalculator);
};
