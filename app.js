var express = require('express');
var path = require('path');
var logger = require('morgan');
var { connectToDatabase } = require("./database")
const config = require('./config')

const PORT = config.port

var indexRouter = require('./routes/indexRoute');
var usersRouter = require('./routes/usersRoute');
var articleRouter = require('./routes/articleRoute');

connectToDatabase()
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articleRouter)



app.listen(PORT, () => {
  console.log('Listening on port, ', PORT)
})

module.exports = app;
