var express = require('express');
var path = require('path');
var logger = require('morgan');

var indexRouter = require('./routes/indexRoute');
var usersRouter = require('./routes/usersRoute');
var articleRouter = require('./routes/articleRoute');

const app = express();

app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articleRouter)

module.exports = app;