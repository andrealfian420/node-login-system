const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();
const PORT = process.env.PORT || 4200;
const homepageRoute = require("./routes/index");
const userRoute = require("./routes/users");
const dbConfig = require("./config/keys").MongoURI;

// Passport Config
require("./config/passport")(passport);

// SETUP MongoDB - Atlas
mongoose
  .connect(dbConfig, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`DB Connected !`))
  .catch((err) => console.log(err));

// Set view engine
app.use(expressLayouts);
app.set("view engine", "ejs");

// Body Parser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
  session({
    secret: "lololol",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Variable
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");

  next();
});

// Routes
app.use("/", homepageRoute);
app.use("/users", userRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
