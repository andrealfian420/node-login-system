const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User Model
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Find if email is exist ?
      User.findOne({ email: email }, (err, user) => {
        if (err) throw err;

        if (!user) {
          return done(null, false, {
            message: `The email is not registered !`,
          });
        }

        // Check the password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;

          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: `The password is invalid !` });
          }
        });
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((_id, done) => {
    User.findById({ _id }, (err, user) => {
      done(err, user);
    });
  });
};
