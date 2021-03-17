require("../db/conn");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");
const middleware = require("../middleware");
const user = require("../models/user");
const { all } = require("../routes/indexRoutes");
const indexRoutes = require("../routes/indexRoutes");
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  require("express-session")({
    secret: "I love the love u love",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.static(__dirname + "public"));
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
app.use("/", indexRoutes);
app.get("/home", middleware.isLoggedIn, (req, res) => {
  res.render("home", { user: req.user });
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/index", (req, res) => {
  res.render("index");
});
app.post("/send", middleware.isLoggedIn, (req, res) => {
  if (req.user.balance < parseInt(req.body.paisa)) {
    res.status(201).render("new", { isAdded: false });
  } else {
    User.findOne({ name: req.body.name }, (err, user1) => {
      const paisa = parseInt(req.body.paisa);
      user1.balance = user1.balance + paisa;
      req.user.balance = req.user.balance - paisa;
      console.log(user1.balance);
      console.log(req.user.balance);
      date = new Date();
      msg1 =
        "You have received " +
        paisa +
        " rupees from " +
        req.user.username +
        " on " +
        date;
      msg2 =
        "You have paid " +
        paisa +
        " rupees to " +
        user1.username +
        " on " +
        date;
      user1.transactions.push(msg1);
      req.user.transactions.push(msg2);
      user1.save();
      req.user.save();
      res.status(201).render("new", { isAdded: true });
    });
  }
});
app.get("/customers", middleware.isLoggedIn, function (req, res) {
  User.find({}, function (err, allusers) {
    if (err) {
      console.log(err);
    } else {
      const itemToBeRemoved = { name: req.user.name };
      allusers.splice(
        allusers.findIndex((a) => a.name === itemToBeRemoved.name),
        1
      );
      res.render("customers", { users: allusers });
    }
  });
});
app.get("/history/:id", function (req, res) {
  User.findById(req.params.id).exec(function (err, founduser) {
    if (err) {
      console.log(err);
      res.redirect("/home");
    } else {
      console.log(founduser);
      res.render("history", { msgs: founduser.transactions });
    }
  });
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/testimony", (req, res) => {
  res.render("testimony");
});
app.get("/customers/:id", function (req, res) {
  User.findById(req.params.id).exec(function (err, founduser) {
    if (err) {
      console.log(err);
      res.redirect("/customers");
    } else {
      res.render("show1", { user: founduser });
    }
  });
});
app.get("/profile/:id", function (req, res) {
  User.findById(req.params.id).exec(function (err, founduser) {
    if (err) {
      console.log(err);
      res.redirect("/home");
    } else {
      res.render("show2", { user: founduser });
    }
  });
});
app.get("/customer/:id/pay", function (req, res) {
  User.findById(req.params.id).exec(function (err, founduser) {
    if (err) {
      console.log(err);
      res.redirect("/send");
    } else {
      res.render("send", { user: founduser });
    }
  });
});
app.get("*", (req, res) => {
  res.status(404).render("error");
});
app.listen(process.env.PORT || 3000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
