"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _axios = _interopRequireDefault(require("axios"));

var _https = _interopRequireDefault(require("https"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//Required when facing ssl certificate error
var agent = new _https["default"].Agent({
  rejectUnauthorized: false //add when working with https sites

});

function getMovie(req, res) {
  console.log("hi " + req);
  var popularity = req.get('popularity'); //setting releaseDate to min if not provided

  if (!req.get('releaseDate')) {
    var releaseDate = new Date(-8640000000000000);
  } else {
    var releaseDate = new Date(req.get('releaseDate'));
  }

  var genres = req.get('genre'); //setting popularity to min if not provided

  if (popularity == null) {
    popularity = Number.MIN_VALUE;
  }

  var movieUrl = 'https://api.themoviedb.org/3/movie/now_playing?api_key=5f87472d074a1553eb87e218a514432d&language=en-US&page=1';
  var genreUrl = 'https://api.themoviedb.org/3/genre/movie/list?api_key=5f87472d074a1553eb87e218a514432d&language=en-US';

  var requestOne = _axios["default"].get(movieUrl, {
    httpsAgent: agent
  });

  var requestTwo = _axios["default"].get(genreUrl, {
    httpsAgent: agent
  });

  _axios["default"].all([requestOne, requestTwo]).then(_axios["default"].spread(function () {
    var responseOne = arguments.length <= 0 ? undefined : arguments[0]; // list of movies

    var responseTwo = arguments.length <= 1 ? undefined : arguments[1]; // list of genreId and genreNames
    //if genre header isnt empty

    if (genres) {
      genres = genres.split(','); // splitting the genre separated by commas in headerfield
      //getting the genre specified with thier Ids

      var genreReq = responseTwo.data.genres.filter(function (item) {
        return genres.includes(item.name);
      });
      var result = responseOne.data.results.filter(function (item) {
        var bool;
        genreReq.forEach(function (element) {
          if (item.genre_ids.includes(element.id)) {
            bool = true;
          }
        }); //comparing genreId,popularity,releasedate

        return bool && item.popularity > popularity && new Date(item.release_date) > releaseDate;
      });
      res.json(result);
    } else {
      var _result = responseOne.data.results.filter(function (item) {
        return item.popularity > popularity && new Date(item.release_date) > releaseDate;
      });

      res.json(_result);
    }
  }))["catch"](function (error) {
    console.log(error);
  });
}

var _default = getMovie;
exports["default"] = _default;