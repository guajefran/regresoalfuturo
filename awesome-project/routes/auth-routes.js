const express    = require("express");
const authRoutes = express.Router();
const passport      = require("passport");

// User model
const User       = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt     = require("bcrypt");
const bcryptSalt = 10;

const ensureLogin = require("connect-ensure-login");

authRoutes.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("private", { user: req.user });
});

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/',
  failureRedirect : '/signup'
}));

authRoutes.get('/login', (req, res) => {
    res.render('auth/login');
});

authRoutes.post('/login', passport.authenticate('local-login', {
  successRedirect : '/',
  failureRedirect : '/login'
}));

// authRoutes.get("/login", (req, res, next) => {
//   res.render("auth/login");
// });
//
// authRoutes.post("/login", passport.authenticate("local", {
//   successRedirect: "/",
//   failureRedirect: "/login",
//   failureFlash: false,
//   passReqToCallback: true
// }));

authRoutes.get("/logout", (req, res) => {
  req.logout("/login");
  res.redirect("/login");
});

authRoutes.get("/auth/facebook", passport.authenticate("facebook"));
authRoutes.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/private-page",
  failureRedirect: "/"
}));


authRoutes.get("/auth/google", passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/plus.profile.emails.read"]
}));

authRoutes.get("/auth/google/callback", passport.authenticate("google", {
  failureRedirect: "/signup",
  successRedirect: "/"
}));
/////////

/*authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username: username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});*/

module.exports = authRoutes;
