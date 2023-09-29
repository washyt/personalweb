const express = require('express'),
  router = express.Router();
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const KEYS = require('../config/keys.json');
const fs = require('fs');
const path = require('path');
let users = path.join(__dirname, "..", "data", "users.json");
let accounts = path.join(__dirname, "..", "data", "accounts.json");
let  parsed_accounts = JSON.parse(fs.readFileSync(accounts));

//keeping our secrets out of our main application is a security best practice
//we can add /config/keys.json to our .gitignore file so that we keep it local/private

let userProfile;

const User = require('../models/user_model');
router.use(session({
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 6000000 //600 seconds of login time before being logged out
  },
  secret: KEYS["session-secret"]
}));
router.use(passport.initialize());
router.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: KEYS["google-client-id"],
    clientSecret: KEYS["google-client-secret"],
    callbackURL: "/auth/google/callback"
    //todo: port==process.env.PORT? :
  },
  function(accessToken, refreshToken, profile, done) {
    userProfile = profile; //so we can see & use details form the profile
    return done(null, userProfile);
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

/*
  This triggers the communication with Google
*/
router.get('/auth/google',
  passport.authenticate('google', {
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
  }));

/*
  This callback is invoked after Google decides on the login results
*/
router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/error?code=401'
  }),
  function(request, response) {
    if (parsed_accounts[request.user._json.email]!= undefined){response.redirect('/PT');}
else{
  response.redirect('/profile');
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;
    let newUser = {
      "email": request.user._json.email,
      "displayName": 0,
      "datecreated": today,
      "profilepic": 0,
    }
  parsed_accounts[request.user._json.email] = newUser;
  fs.writeFileSync(accounts, JSON.stringify(parsed_accounts));

}

  });

router.get("/auth/logout", (request, response) => {
  request.logout();
  let userID = request.user._json.email;
  response.redirect('/');
});

module.exports = router;
