var express = require('express');
var router = express.Router();
var service = require('../service/movieservice');

//Circuit Breaker
const CircuitBreaker = require('../circuitbreaker/CircuitBreaker');
const breaker = new CircuitBreaker(service.getMovie);


/* GET movies listing. */
router.get('/', function (req, res, next) {
        //service.getMovie(req,res);
        breaker.fire(req)
        .then(console.log)
        .catch(console.error);
});


module.exports = router;
