const JWTStrategy = require("passport-jwt").Strategy;
const extractJWT = require("passport-jwt").ExtractJwt;
const userModel = require("../Models/User");

module.exports = function (passport) {
  passport.use(
    new JWTStrategy(
      {
        secretOrKey: process.env.SECRET,
        jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
      },
      (jwt_payload, cb) => {
        userModel.findOne({ email: jwt_payload.email }, (err, user) => {
          if (err) {
            return cb(err, false);
          }
          if (user) {
            return cb(null, user);
          } else {
            return cb(null, false);
          }
        });
      }
    )
  );
};
