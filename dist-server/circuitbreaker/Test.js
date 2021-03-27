"use strict";

var CircuitBreaker = require('./CircuitBreaker.js'); // Our unstable request simulation


var unstableRequest = function unstableRequest() {
  return new Promise(function (resolve, reject) {
    if (Math.random() > .6) {
      resolve({
        data: "Success"
      });
    } else {
      reject({
        data: "Failed"
      });
    }
  });
};

var breaker = new CircuitBreaker(unstableRequest);
setInterval(function () {
  breaker.fire().then(console.log)["catch"](console.error);
}, 1000);