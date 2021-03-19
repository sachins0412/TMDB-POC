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
    if(!req.get('releaseDate')){
        console.log("poopop");
        releaseDate=new Date(-8640000000000000);
    }
    else{
        releaseDate = new Date(req.get('releaseDate'));
    }
    var genres = req.get('genre');
    if (popularity == null) {
        popularity = Number.MIN_VALUE;
    }
    var movieUrl = 'https://api.themoviedb.org/3/movie/now_playing?api_key=5f87472d074a1553eb87e218a514432d&language=en-US&page=1';
    var genreUrl = 'https://api.themoviedb.org/3/genre/movie/list?api_key=5f87472d074a1553eb87e218a514432d&language=en-US';
    var requestOne = axios.get(movieUrl, { httpsAgent: agent });
    var requestTwo = axios.get(genreUrl, { httpsAgent: agent });
    axios.all([requestOne, requestTwo])
        .then(axios.spread((...responses) => {
            const responseOne = responses[0];
            const responseTwo = responses[1];
            if (genres) {
                genres = genres.split(',');

                const genreReq = responseTwo.data.genres
                    .filter(item => genres.includes(item.name));

                const result = responseOne.data.results
                    .filter(item => {
                        var bool;
                        genreReq.forEach(element => {
                            if (item.genre_ids.includes(element.id)) {
                                bool = true;
                            }
                        });
                        return (bool && (item.popularity > popularity) && (new Date(item.release_date)) > releaseDate);
                    });
                res.json(result);
            }
            else {
                const result = responseOne.data.results
                    .filter(item => item.popularity > popularity &&
                        (new Date(item.release_date)) > releaseDate);
                res.json(result);
            }
        }
        )).catch(function (error) {
            console.log(error);
        })

});

module.exports = router;
