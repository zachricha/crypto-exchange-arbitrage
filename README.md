# Crypto-Exchange-Arbitrage
Crypto Exchange Arbitrage uses the [ccxt](https://github.com/ccxt/ccxt) library to gather ticker data from multiple exchanges and calculates the arbitrage opportunites between them.


Quick start
----
```sh
$npm install crypto-exchange-arbitrage
```

```javascript
const arbitrage = require('crypto-exchange-arbitrage');

arbitrage({exchanges: ['binance', 'bittrex']}, function(err, result) {
  if (err) {
    return console.log(err);
  };
  console.log(result);
});
```

Usage
----

```javascript
const arbitrage = require('crypto-exchange-arbitrage');

let options = {
  exchanges: ['kraken', 'bitfinex2', 'bittrex', 'binance', 'liqui', 'kucoin', 'hitbtc2'],
  percent: 2.5,
  usdToUsdt: false,
};

arbitrage(options, function(err, result) {
  if (err) {
    return console.log(err);
  };
  console.log(result);
});
```

#### exchanges

Type: ``Array<String>``

Exchanges is an array of exchange id's from the ccxt library. Each exchange looks for any arbitrage opportunities from all of the exchanges in the arrray. For a list of usable exchange id's check out the supported exchanges on the [ccxt github](https://github.com/ccxt/ccxt/wiki/Manual#exchanges)(some exchanges will not work due to there being no fetchTickers support for that particular api).

#### percent

Type: ``Number``
Default: ``1``

Percent sets what percentage an arbitrage opportunity has to be greater than or equal to, in order to be returned.

#### usdToUsdt

Type: ``Boolean``
Default: ``True``

usdToUsdt sets whether or not USD and USDT pairs are considered equal and therefore compared.

License
----
MIT
