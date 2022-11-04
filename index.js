//installing packages
var express = require('express');
var path = require('path');
var logger = require('morgan');

//importing routes
var usersRouter = require('./routes/usersRoute');
var articleRouter = require('./routes/articleRoute');

const app = express();

app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//setting up routes
app.use('/users', usersRouter);
app.use('/articles', articleRouter)

// home route
app.get('/', (req, res) => {
    return res.json({ status: true })
})

// 404 route
app.use('*', (req, res) => {
    return res.status(404).json({ message: 'route not found' })
})

module.exports = app;