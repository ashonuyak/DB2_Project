const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");

const { UserDB } = require("../../user/models/UserDB");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
  secretOrKey: "super_secret",
};

module.exports = new JwtStrategy(opts, (jwtPayload, done) => {
  if (jwtPayload.expiresIn <= new Date().getTime()) {
    done({ isPassport: true, message: "Expired access token." }, false);
  }

  UserDB.get(jwtPayload.id)
    .then((user) => done(null, user))
    .catch((err) => done({ isPassport: true, message: err.message }, false));
});
