const createError = require('http-errors');
const express = require('express');
const path = require('path');
let logger = require('morgan');

const indexRouter = require('./routes/index');
const customerRouter = require('./routes/customerRoutes');
const orderRouter = require('./routes/orderRoutes');
const foodItemRouter = require('./routes/foodItemsRoutes');

const app = express();
require('./db/dbConnect');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/customers', customerRouter);
app.use('/api/orders', orderRouter);
app.use('/api/foodItems', foodItemRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send({error: err.message});
  console.log(err);
});

module.exports = app;
