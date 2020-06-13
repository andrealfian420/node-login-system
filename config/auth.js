module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }

    req.flash("error_msg", "Please login before proceeding");
    res.redirect("/users/login");
  },
  isAlreadyLogin: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }

    res.redirect("/dashboard");
  },
};
