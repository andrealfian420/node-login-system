const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { isAlreadyLogin } = require("../config/auth");

// User Model
const User = require("../models/User");

// Login page
router.get("/login", isAlreadyLogin, (req, res) => {
  res.render("login");
});

// Register page
router.get("/register", isAlreadyLogin, (req, res) => {
  res.render("register");
});

// Handle Registration
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  const errors = [];

  // Check if user fill all the required fields
  if (!name || !email || !password || !password2) {
    errors.push({
      msg: "Please fill all the required fields !",
    });
  }

  // Check if password and password2 is same or not
  if (password !== password2) {
    errors.push({
      msg: "Password doesn't match !",
    });
  }

  // Check if password is 6 characters long
  if (password.length < 6) {
    errors.push({
      msg: "The password should be at least six characters or longer !",
    });
  }

  // Check if there's an error(s)
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // Validation all ok

    // Check if user already exist ?
    User.findOne({ email: email }, (err, data) => {
      if (err) throw new Error(err);

      if (data) {
        // User already exist
        errors.push({
          msg: "The email is already registered !",
        });

        res.render("register", {
          errors,
        });
      } else {
        // Save the user to database
        const newUser = new User({
          name,
          email,
          password,
        });

        // Create Password Hash
        bcrypt.genSalt(16, (err, salt) => {
          if (err) throw new Error(err);

          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw new Error(err);

            // Set password as hashed password
            newUser.password = hash;

            // Save
            newUser.save((err, data) => {
              if (err) throw err;

              req.flash("success_msg", "You can login now !");
              res.redirect("/users/login");
            });
          });
        });
      }
    });
  }
});

// Login Handler
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout Handler
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", `Yo're now logged out !`);
  res.redirect("/users/login");
});

module.exports = router;
