var express = require('express');
var router = express.Router();
var service = require('../service/movieservice');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));
/* GET movies listing. */
router.get('/', function (req, res, next) {
        service.getMovie(req,res);
});

module.exports = router;
