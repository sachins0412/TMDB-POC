var express = require('express');
const axios = require('axios');
const https = require('https');

//Required when facing ssl certificate error
const agent = new https.Agent({
    rejectUnauthorized: false,//add when working with https sites

});

function getMovie(req, res) {
    console.log("hi "+req);
    var popularity = req.get('popularity');
    //setting releaseDate to min if not provided
    if (!req.get('releaseDate')) {
        releaseDate = new Date(-8640000000000000);
    }
    else {
        releaseDate = new Date(req.get('releaseDate'));
    }
    var genres = req.get('genre');
    //setting popularity to min if not provided
    if (popularity == null) {
        popularity = Number.MIN_VALUE;
    }
    var movieUrl = 'https://api.themoviedb.org/3/movie/now_playing?api_key=5f87472d074a1553eb87e218a514432d&language=en-US&page=1';
    var genreUrl = 'https://api.themoviedb.org/3/genre/movie/list?api_key=5f87472d074a1553eb87e218a514432d&language=en-US';
    var requestOne = axios.get(movieUrl, { httpsAgent: agent });
    var requestTwo = axios.get(genreUrl, { httpsAgent: agent });
    axios.all([requestOne, requestTwo])
        .then(axios.spread((...responses) => {
            const responseOne = responses[0];  // list of movies
            const responseTwo = responses[1];  // list of genreId and genreNames
            //if genre header isnt empty
            if (genres) {
                genres = genres.split(',');// splitting the genre separated by commas in headerfield
                //getting the genre specified with thier Ids
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
                        //comparing genreId,popularity,releasedate
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
}

exports.getMovie=getMovie;