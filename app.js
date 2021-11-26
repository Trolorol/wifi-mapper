var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// File Upload
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

var app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var uploadRouter = require('./routes/fileUploadRoutes');
var pointsRouter = require('./routes/pointsRoutes');


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join('public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/api/file_upload', uploadRouter);
app.use('/api/points', pointsRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



module.exports = app;