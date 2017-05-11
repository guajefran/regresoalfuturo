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
}
