const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const { Schema } = mongoose;
const userSchema = new Schema({
  email: { type: String, unique: true, trim: true, lowercase: true },
  password: String
});

userSchema.methods.comparePasswords = function(typedPassword, cb) {
  bcrypt.compare(typedPassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    return cb(null, isMatch);
  });
};

userSchema.pre("save", function(next) {
  console.log({ this: this });
  const user = this;
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, (err, hashedPassword) => {
      if (!err) {
        user.password = hashedPassword;
        next();
      }
    });
  });
});
module.exports = mongoose.model("User", userSchema);
