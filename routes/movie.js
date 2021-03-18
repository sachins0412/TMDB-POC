var express = require('express');
var router = express.Router();
const axios = require('axios');
const https = require('https');
//const { options } = require('../app');
const agent = new https.Agent({
    rejectUnauthorized: false,//add when working with https sites

});
/* GET movies listing. */
router.get('/', function (req, res, next) {
    var popularity = req.get('popularity');
    var releaseDate = new Date(req.get('releaseDate'));
    axios.get('https://api.themoviedb.org/3/movie/now_playing?' +
        'api_key=5f87472d074a1553eb87e218a514432d&language=en-US&page=1', { httpsAgent: agent })
        .then(function (response) {
            const result = response.data.results
                .filter(item => item.popularity > popularity &&
                    (new Date(item.release_date)) > releaseDate);
            res.json(result);
            //console.log(res);
        }).catch(function (error) {
            console.log(error);
        })
});

module.exports = router;
