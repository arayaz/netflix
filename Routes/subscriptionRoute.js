const express = require("express");
const router = express.Router();

const {
  fetchSubscriptions,
  addSubscriptions,
} = require("../controllers/subscription.controllers");

router.get("/", fetchSubscriptions);

router.post("/", addSubscriptions);

module.exports = router;
