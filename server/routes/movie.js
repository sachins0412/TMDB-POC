import express from 'express';
var router = express.Router();
import service from '../service/movieservice';
//Circuit Breaker
import CircuitBreaker from '../circuitbreaker/CircuitBreaker';
const breaker = new CircuitBreaker(service);

console.log(service);
/* GET movies listing. */
router.get('/', function (req, res, next) {
        service(req,res);
        /* breaker.fire(req)
        .then(console.log)
        .catch(console.error); */
});


export default router;
