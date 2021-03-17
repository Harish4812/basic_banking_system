const  MObj = {};
MObj.isLoggedIn = function(req, res, next){
  if (req.isAuthenticated()) {
  return next();
}
res.redirect("/index");
}
module.exports = MObj;