var express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser')
var http = require('http');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
import { Request, Response, NextFunction } from 'express'

var app = express();
app.use(cors())
app.use(bodyParser.json())
require('dotenv').config();

var server = http.createServer(app);
let port = process.env.port
server.listen(port);

app.use(express.json());
app.use(logger('dev'));
app.use(cookieParser());

app.get('/', (req: any, res: any) => {
  res.send('hello world')
})

var mongooseDB = require('mongoose')
const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env
mongooseDB.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}.lohsbkk.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}).then(() => {
  console.log('DB Connect');
}).catch((err: any) => {
  console.log('DB Connect fail');
  console.log(err);
})

var auth = require('../src/routes/auth')
app.use('/v1/auth', auth)

var users = require('../src/routes/users')
app.use('/v1/users', users)

var products = require('../src/routes/products')
app.use('/v1/products', products)

var orders = require('../src/routes/orders')
app.use('/v1/orders', orders)

var createError = require('http-errors');
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});