const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
router.get("/", function (req, res) {
  res.redirect("/index");
});
router.get("/register", function(req,res){
  res.render("register");
});
router.post("/register", function(req,res){
console.log(req.body);
const { name, username, accountNo, ifsc, balance } = req.body;
const newUser = new User({ name: name, username: username, accountNo: accountNo, ifsc: ifsc, balance: balance, transactions: [] });
User.register(newUser, req.body.password, function(err,user){
    if (err) {
      console.log(err);
      return res.rend("index");
    } 
  passport.authenticate("local")(req,res,function(){
  res.redirect("/home");
  })
});
});
router.get("/login", function (req, res) {
res.render("login");
});
router.get("/", function (req, res) {
res.render("index");
});
router.post("/login", passport.authenticate("local", {
successRedirect: "/home",
failureRedirect: "/index",
failureFlash: true
}));
router.get("/logout", function (req, res) {
req.logout();
res.redirect("/index");
});
module.exports = router;

