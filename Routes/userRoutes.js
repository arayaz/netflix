const express = require("express");
const passport = require("passport");

require("../Config/passport")(passport);

const router = express.Router();

const {
  registerUser,
  login,
  planSubscription,
  getUsers,
  getSubscription,
  viewContent,
} = require("../controllers/user.controllers");

router.get("/", passport.authenticate("jwt", { session: false }), getUsers);

router.post("/registration", registerUser);

router.post("/login", login);

router.post(
  "/plan-subscription",
  passport.authenticate("jwt", { session: false }),
  planSubscription
);

router.put(
  "/plan-subscription",
  passport.authenticate("jwt", { session: false }),
  planSubscription
);

router.get(
  "/plan-subscription",
  passport.authenticate("jwt", { session: false }),
  getSubscription
);

router.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  viewContent
);

router.get(
  "/series",
  passport.authenticate("jwt", { session: false }),
  viewContent
);

router.get(
  "/originals",
  passport.authenticate("jwt", { session: false }),
  viewContent
);

module.exports = router;
