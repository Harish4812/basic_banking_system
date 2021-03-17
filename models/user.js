const mongoose = require("mongoose");
passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = mongoose.Schema({
  name:String,
  username:String,
  password:String,
  accountNo:Number,
  ifsc:String,
  balance:Number,
  transactions:Array,
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);