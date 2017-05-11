const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const logger = require('morgan')
const layouts = require('express-ejs-layouts')

module.exports = function(app, config){
  app.set('views', config.rootPath+'views')
  app.set('view engine', 'ejs')
  app.use(logger('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(express.static(config.rootPath+'public'))
  app.use(layouts)
  app.use(session({
    secret: 'ironfundingdev',
    resave: false,
    saveUninitialized: true,
  }))
  app.use(passport.initialize())
  app.use(passport.session())

  // app.use('/', authRoutes)
  // app.use('/', index)
  app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
  })

  app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
  })
}
