async function cryptoExchangeArbitrage(options, callback) {
  'use strict';

  var exchanges = options.exchanges;
  var greaterThan = options.percent || 1;
  var usdIsUsdt = options.usdIsUsdt || true;

  var err = null;

  if(!Array.isArray(exchanges)) {
    err = new Error(`${exchanges} is not an array`);
    return callback(err, null);
  };

  const ccxt = require('ccxt');

  var result = [];

  const promises = exchanges.map(async (exchange) => {
    const exch = await new ccxt[exchange]().fetchTickers();
    return {id: exchange, data: exch};
  });

  await Promise.all(promises).then((allExchanges) => {
    reduceExchCompares(allExchanges);
  }).catch(e => {
    err = e;
  });

  function reduceExchCompares(allExchanges) {

    var alreadyChecked = [];

    for(var i = 0; i < allExchanges.length; i++) {
      for(var j = 0; j < allExchanges.length; j++) {
        var joinedExchanges = allExchanges[i].id + (allExchanges[j].id);
        var joinedExchanges2 = allExchanges[j].id + (allExchanges[i].id);

        if (allExchanges[i].id === allExchanges[j].id ||
        alreadyChecked.indexOf(joinedExchanges) > -1 ||
        alreadyChecked.indexOf(joinedExchanges2) > -1) {
          continue;
        };
        alreadyChecked.push(joinedExchanges, joinedExchanges2);

        var exchName1 = allExchanges[i].id;
        var exchName2 = allExchanges[j].id;

        var exch1 = allExchanges[i].data;
        var exch2 = allExchanges[j].data;

        getTickerArbitrage(exchName1, exchName2, exch1, exch2);
      };
    };
  };

  function getTickerArbitrage(exchName1, exchName2, exch1, exch2) {
    for(var key1 in exch1) {
      for(var key2 in exch2) {
        var exchange1 = key1;
        var exchange2 = key2;

        if(usdIsUsdt) {
          var pair1 = key1.split('/')[1];
          var pair2 = key2.split('/')[1];

          if(pair1 === 'USD') {exchange1 = key1.split('/')[0] + 'USDT'};
          if(pair2 === 'USD') {exchange2 = key2.split('/')[0] + 'USDT'};
        };

        if(exchange1 === exchange2) {

          var exch1ToExch2 = (exch2[key2].bid / exch1[key1].ask)*100;
          var exch2ToExch1 = (exch1[key1].bid / exch2[key2].ask)*100;

          var percentDiff = 100 + greaterThan;

          if(exch1ToExch2 >= percentDiff && exch1[key1].ask > 0) {

            var arbitragePercent = (exch1ToExch2 - 100).toFixed(2);
            var symbol = exchange1;
            var buyAt = exchName1;
            var sellAt = exchName2;
            var buyAsk = exch1[key1].ask;
            var sellBid = exch2[key2].bid;
            var buyAskQty = exch1[key1].info.askQty;
            var sellBidQty = exch2[key2].info.BidQty;
            var buyInfo = exch1[key1];
            var sellInfo = exch2[key2];

          } else if(exch2ToExch1 >= percentDiff && exch2[key2].ask > 0) {

            var arbitragePercent = (exch2ToExch1 - 100).toFixed(2);
            var symbol = exchange2;
            var buyAt = exchName2;
            var sellAt = exchName1;
            var buyAsk = exch2[key2].ask;
            var sellBid = exch1[key1].bid;
            var buyAskQty = exch2[key2].info.askQty;
            var sellBidQty = exch1[key1].info.BidQty;
            var buyInfo = exch2[key2];
            var sellInfo = exch1[key1];

          } else {
            break;
          };

          if(arbitragePercent === Infinity) {
            break;
          };

          var maxBuySellQty = buyAskQty <= sellBidQty ? buyAskQty : sellBidQty;

          result.push({
            arbitragePercent,
            symbol,
            buyAt,
            sellAt,
            buyAsk,
            sellBid,
            buyAskQty,
            sellBidQty,
            maxBuySellQty,
            buyInfo,
            sellInfo,
          });

          break;
        };
      };
    };
  };
  if(err) {
    callback(err, null);
  } else {
    callback(null, result);
  };
};

module.exports = cryptoExchangeArbitrage;
