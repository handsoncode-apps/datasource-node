var express = require('express')
var logger = require('morgan')
var bodyParser = require('body-parser')

var users = require('./routes/users')

var app = express()
var port = 3005

app.use(logger('dev'))
app.use(bodyParser.json())
app.set('view engine', 'pug')

app.use('/users', users)
app.use(express.static('public'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.listen(port, function () {
  console.log('Listening on port ' + port + '..')
})

module.exports = app
