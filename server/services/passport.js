const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local");
const { ExtractJwt } = require("passport-jwt");
const User = require("../models/User");
const { secret } = require("../config/keys");

//configure JWT options
const jwtOptions = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJwt.fromHeader("authorization")
};
const localOptions = { usernameField: "email" };
const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  const user = await User.findById(payload.sub);
  if (!user) {
    return done(null, false);
  }
  return done(null, user);
});
const localLogin = new LocalStrategy(
  localOptions,
  async (email, typedPassword, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false);
      }
      console.log(user);
      //if the user exists, we compare their password to the typed password
      user.comparePasswords(typedPassword, (err, isMatch) => {
        if (err) return done(err);
        if (!isMatch) return done(null, false);
        return done(null, user);
      });
    } catch (error) {
      console.log({ error });
    }
  }
);

passport.use(jwtLogin);
passport.use(localLogin);
