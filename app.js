var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverride = require('method-override');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var peliculasRouter = require('./routes/peliculas_routes');
var funcionesRouter = require('./routes/funciones_routes');
var salasRouter = require('./routes/salas_routes');
var ventasRouter = require('./routes/ventas_routes');
var productosRouter = require('./routes/productos_routes');
var entradasRouter = require('./routes/entradas_routes');
var ventasProductosRouter = require('./routes/ventas_productos_routes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/peliculas', peliculasRouter);
app.use('/funciones', funcionesRouter);
app.use('/salas', salasRouter);
app.use('/ventas', ventasRouter);
app.use('/productos', productosRouter);
app.use('/entradas', entradasRouter);
app.use('/ventas_productos', ventasProductosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
