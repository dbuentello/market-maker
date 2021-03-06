"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var ripple = require("ripple-lib");
var Promise = require("bluebird");

var Offer = (function () {
  function Offer(options) {
    if (!options.buy) {
      throw new Error("options.buy must include currency and amount");
    }
    if (!options.buy.currency) {
      throw new Error("options.buy must include currency and amount");
    }
    if (!options.buy.amount) {
      throw new Error("options.buy must include currency and amount");
    }
    if (!options.sell) {
      throw new Error("options.sell must include currency and amount");
    }
    if (!options.sell.currency) {
      throw new Error("options.sell must include currency and amount");
    }
    if (!options.sell.amount) {
      throw new Error("options.sell must include currency and amount");
    }
    this.account = options.account;
    this.buy = options.buy;
    this.sell = options.sell;
  }

  _prototypeProperties(Offer, null, {
    submit: {
      value: function submit(options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
          if (!options.secret) {
            reject(new Error("options.secret must be provided to sign offer"));
          }

          var remote = new ripple.Remote({
            servers: ["wss://s1.ripple.com:443"]
          });

          remote.connect(function () {
            remote.setSecret(_this.account, options.secret);

            var transaction = remote.createTransaction("OfferCreate", {
              account: _this.account,
              taker_pays: _this.sell.amount + "/" + _this.sell.currency,
              taker_gets: _this.buy.amount + "/" + _this.buy.currency
            });

            transaction.submit(function (err, res) {
              if (err) {
                return reject(err);
              }
              resolve(res);
            });
          });
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Offer;
})();

module.exports = Offer;