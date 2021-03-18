var express = require('express');
var router = express.Router();
const axios = require('axios');
const https = require('https');
//const { options } = require('../app');
const agent = new https.Agent({
    rejectUnauthorized: false,//add when working with https sites

});
const options = {
    headers: {
        popularity: 7
    }
};
/* GET movies listing. */
router.get('/', function (req, res, next) {
    axios.get('https://api.themoviedb.org/3/movie/now_playing?' +
        'api_key=5f87472d074a1553eb87e218a514432d&language=en-US&page=1', { httpsAgent: agent }, options)
        .then(function (response) {
            res.json(response.data);
            console.log(res);
        }).catch(function (error) {
            console.log(error);
        })
});

module.exports = router;
