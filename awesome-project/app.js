const express = require('express')
const favicon = require('serve-favicon')
const index = require('./routes/index')
const authRoutes = require("./routes/auth-routes")
const matchRoute = require('./routes/matchRoutes')
const teamRoute = require('./routes/teamRoutes')

const app = express()

require('./config/passport')()
require('./config/express')(app)

app.use('/', authRoutes)
app.use('/', index)
app.use('/team', teamRoute)
app.use('/match', matchRoute)

app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
