const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts');
const mongoose     = require('mongoose');
const session       = require("express-session");
const bcrypt        = require("bcrypt");
const passport      = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");
const FbStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const User               = require('./models/user');
const index = require('./routes/index');
const authRoutes = require("./routes/auth-routes");

const matchRoute = require('./routes/matchRoutes');
const teamRoute = require('./routes/teamRoutes');

const app = express();


mongoose.connect('mongodb://localhost/awesome-project');

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

var dotenv = require ("dotenv").load()
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);
app.use(session({
  secret: 'ironfundingdev',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', authRoutes);
app.use('/', index);
app.use('/team', teamRoute);
app.use('/match', matchRoute);


// NEW

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser((id, cb) => {

  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// Signing Up
passport.use('local-signup', new LocalStrategy(
  { passReqToCallback: true },
  (req, username, password, next) => {
    // To avoid race conditions
    process.nextTick(() => {
        User.findOne({
            'username': username
        }, (err, user) => {
            if (err){ return next(err); }

            if (user) {
                return next(null, false);
            } else {
                // Destructure the body
                const { username, email, password } = req.body;
                const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                const newUser = new User({
                  username,
                  email,
                  password: hashPass
                });

                newUser.save((err) => {
                    if (err){ next(err); }
                    return next(null, newUser);
                });
            }
        });
    });
}));
// NEW


// default value for title local
app.locals.title = 'ALMANAC - Back to the future';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));



passport.use('local-login', new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" })
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" })
    }


    return next(null, user);
  });
}));


// catch 404 and forward to error handler

app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// passport.serializeUser((user, next) => {
//   next(null, user);
// });
// passport.deserializeUser((user, next) => {
//   next(null, user);
// });

//FACEBOOK.........
passport.use(new FbStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/callback"
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ username: profile._json.name }, (err, user) => {
  if (err) { return done(err) }
  if (user === null){
    var newUser = new User({
      username: profile._json.name,
      facebookID: profile._json.id
    })
    newUser.save((err) => {
      if (err) {return done(err)}
      return done(null, newUser)
    })
  } else {
   done(null, user)
   }

  });
}));

//GOOGLE +

passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_ID'],
  clientSecret: process.env['GOOGLE_SECRET'],
  callbackURL: "http://localhost:3000/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ googleID: profile.id }, (err, user) => {
    if (user === null){
      var newUser = new User({
        username: profile.emails[0].value,
        googleID: profile.id
      })
      newUser.save((err) => {
        if (err) { return done(err)}
        return done(null, newUser)
      })
    } else {
       done(null, user)
    }
  })
}))



module.exports = app
