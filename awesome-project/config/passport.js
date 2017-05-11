const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const flash = require("connect-flash")
const FbStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy
const User = require('../models/User')
const dotenv = require ("dotenv").load()

module.exports = function (){
  passport.serializeUser((user, cb) => {
    cb(null, user.id)
  })

  passport.deserializeUser((id, cb) => {

    User.findById(id, (err, user) => {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });

  passport.use('local-signup', new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, next) => {
      process.nextTick(() => {
          User.findOne({
              'username': username
          }, (err, user) => {
              if (err){ return next(err); }

              if (user) { return next(null, false) }
              else {
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
  passport.use('local-login', new LocalStrategy((username, password, next) => {
    User.findOne({ username }, (err, user) => {
      if (err) { return next(err) }
      if (!user) {
        return next(null, false, { message: "Incorrect username" })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, { message: "Incorrect password" })
      }
      return next(null, user);
    });
  }));

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
    } else { done(null, user) }
    });
  }));

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
      } else { done(null, user) }
    })
  }))
}
