var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require("swagger-ui-express");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var movieRouter = require('./routes/movie');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var breaker=require('express-circuit-breaker');

var CB = breaker({
    catchError: e => 'trip',
    handleBlockedRequest: (req, res) => res.sendStatus(500)
  })
   
app.get('/unprotected', (req, res) => res.sendStatus(200))
   
app.get('/protected', CB, (req, res) => res.sendStatus(200))

const swaggerOptions = {
  swaggerDefinition: {
    info:{
      version:"1.0.0",
      title:"TMDB API",
      descripton:"Retrives movies after applying differnet filters",
      contact: {
        name :"OGDeveloper"
      },
      servers:["http://localhost:3000"]
    }
  },
  apis:["app.js"],
};

const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * @swagger
 * /movie:
 *  get:
 *    description: Use to request all movies
 *    responses:
 *      200:
 *        description: A successful response
 */
app.use('/movie',movieRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
