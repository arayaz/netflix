const express = require("express");
const passport = require("passport");

require("dotenv").config();

const userRoutes = require("./Routes/userRoutes");
const subscriptionRoutes = require("./Routes/subscriptionRoute");

const mongoose = require("mongoose");

mongoose.connect(
  process.env.DB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => console.log("Database Connected")
);

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use(passport.initialize());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/subscription", subscriptionRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
