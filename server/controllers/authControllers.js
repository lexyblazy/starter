const passport = require("passport");
const User = require("../models/User");
const jwt = require("jwt-simple");
const { secret } = require("../config/keys");

const tokenForUser = user => {
  return jwt.encode({ sub: user._id, iat: new Date().getTime() }, secret);
};
exports.isLoggedIn = passport.authenticate("jwt", { session: false });
exports.signInWithEmailAndPassword = passport.authenticate("local", {
  session: false
});

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send({ error: "Complete required fields" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send({ error: "User with given email already exists" });
    }
    const newUser = new User(req.body);
    await newUser.save();
    res.send({ token: tokenForUser(newUser) });
  } catch (error) {
    res.send({ error });
  }
};

exports.receiveToken = (req, res) => {
  const token = tokenForUser(req.user);
  res.send({ token });
};
