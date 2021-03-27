"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _movieservice = _interopRequireDefault(require("../service/movieservice"));

var _CircuitBreaker = _interopRequireDefault(require("../circuitbreaker/CircuitBreaker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

var breaker = new _CircuitBreaker["default"](_movieservice["default"]);
console.log(_movieservice["default"]);
/* GET movies listing. */

router.get('/', function (req, res, next) {
  (0, _movieservice["default"])(req, res);
  /* breaker.fire(req)
  .then(console.log)
  .catch(console.error); */
});
var _default = router;
exports["default"] = _default;