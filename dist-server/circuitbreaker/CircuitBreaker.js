"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CircuitBreaker = /*#__PURE__*/function () {
  function CircuitBreaker(request) {
    _classCallCheck(this, CircuitBreaker);

    this.request = request;
    this.state = "CLOSED";
    this.failureThreshold = 3;
    this.failureCount = 0;
    this.successThreshold = 2;
    this.successCount = 0;
    this.timeout = 6000;
    this.nextAttempt = Date.now();
  }

  _createClass(CircuitBreaker, [{
    key: "fire",
    value: function () {
      var _fire = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(this.state === "OPEN")) {
                  _context.next = 6;
                  break;
                }

                if (!(this.nextAttempt <= Date.now())) {
                  _context.next = 5;
                  break;
                }

                this.state = "HALF";
                _context.next = 6;
                break;

              case 5:
                throw new Error("Circuit is currently OPEN");

              case 6:
                _context.prev = 6;
                _context.next = 9;
                return this.request();

              case 9:
                response = _context.sent;
                return _context.abrupt("return", this.success(response));

              case 13:
                _context.prev = 13;
                _context.t0 = _context["catch"](6);
                return _context.abrupt("return", this.fail(_context.t0));

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[6, 13]]);
      }));

      function fire() {
        return _fire.apply(this, arguments);
      }

      return fire;
    }()
  }, {
    key: "success",
    value: function success(response) {
      if (this.state === "HALF") {
        this.successCount++;

        if (this.successCount > this.successThreshold) {
          this.successCount = 0;
          this.state = "CLOSED";
        }
      }

      this.failureCount = 0;
      this.status("Success");
      return response;
    }
  }, {
    key: "fail",
    value: function fail(err) {
      this.failureCount++;

      if (this.failureCount >= this.failureThreshold) {
        this.state = "OPEN";
        this.nextAttempt = Date.now() + this.timeout;
      }

      this.status("Failure");
      return err;
    }
  }, {
    key: "status",
    value: function status(action) {
      console.table({
        Action: action,
        Timestamp: Date.now(),
        Successes: this.successCount,
        Failures: this.failureCount,
        State: this.state
      });
    }
  }]);

  return CircuitBreaker;
}();

module.exports = CircuitBreaker;