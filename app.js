var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');
var uploadRouter = require('./routes/uploadRouter');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//app.use(cookieParser('Secret Key'));

app.use(passport.initialize());

app.use(cors({origin: 'https://localhost:3000'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promos', promoRouter);
app.use('/imageUpload', uploadRouter);

const connect = mongoose.connect(process.env.DB_URL);
connect.then((db) => {
    console.log('Connected to db server');
}, err => console.log(err));
module.exports = app;