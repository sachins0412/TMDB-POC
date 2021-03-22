var express = require('express');
var router = express.Router();
var service = require('../service/movieservice');

/* GET movies listing. */
router.get('/', function (req, res, next) {
        service.getMovie(req,res);
});

module.exports = router;
