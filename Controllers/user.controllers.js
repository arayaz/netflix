const userModel = require("../Models/User");
const subscriptionModel = require("../Models/Subscription");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = (req, res) => {
  let nextDueDate = new Date();
  nextDueDate.setDate(nextDueDate.getDate() + 30);

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      const newUser = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        avatar: req.body.avatar,
        subscription: "611ad7956498b8763fd4f1a0",
        nextPaymentDate: nextDueDate,
        nextPaymentAmount: 0,
      });

      newUser
        .save()
        .then((user) => {
          res.json({
            message: "success",
            data: user,
          });
        })
        .catch((e) => {
          console.log(e.message);
          return res.status(405).json({ message: "Masla Ho Gya Hai" });
        });
    });
  });
};

const login = (req, res) => {
  userModel
    .findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Invalid Credentials" });
      }
      const passwordMatch = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (passwordMatch) {
        const params = {
          email: user.email,
          name: user.name,
          subscription: user.subscription,
        };
        const token = jwt.sign(params, process.env.SECRET, {
          expiresIn: "1d",
        });

        return res.status(200).json({ message: "Token Generated", token });
      }
    })
    .catch((e) => {
      console.log(e.message);
      return res.status(400).json({ message: "Masla Ho Gya Hai" });
    });
};

const planSubscription = (req, res) => {
  const token = req.headers.authorization.split(" ");
  const decoded = jwt.verify(token[1], process.env.SECRET);
  subscriptionModel
    .findOne({ _id: req.body.subscription })
    .then((plan) => {
      if (!plan) {
        return res.status(404).json({ message: "Invalid Subscription Plan" });
      }
      userModel
        .findOneAndUpdate(
          { email: decoded.email },
          { $set: { subscription: plan._id } },
          { new: true }
        )
        .then((user) => {
          return res
            .status(200)
            .json({ message: "Subscription Plan Updated", data: user });
        })
        .catch((e) => {
          console.log(e.message);
          return res.status(400).json({ message: "Masla Ho Gya Hai" });
        });
    })
    .catch((e) => {
      console.log(e.message);
      return res.status(400).json({ message: "Masla Ho Gya Hai" });
    });
};

// const updateSubscription = (req, res) => {
//   res.status(200).json({ message: "Update Plan" });
// };

const getSubscription = (req, res) => {
  const token = req.headers.authorization.split(" ");
  const decoded = jwt.verify(token[1], process.env.SECRET);
  userModel
    .findOne({ email: decoded.email })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: "No User Found" });
      }
      subscriptionModel
        .findOne({ _id: user.subscription })
        .then((plan) => {
          if (!plan) {
            return res
              .status(404)
              .json({ message: "Invalid Subscription Plan" });
          }
          return res.status(200).json({ message: "Success", data: plan });
        })
        .catch((e) => {
          console.log(e.message);
          return res.status(400).json({ message: "Masla Ho Gya Hai" });
        });
    })
    .catch((e) => {
      console.log(e.message);
      return res.status(400).json({ message: "Masla Ho Gya Hai" });
    });
};

const getUsers = (req, res) => {
  userModel
    .find()
    .then((users) => {
      if (users.length === 0) return res.json({ message: "No Users Found" });
      res.json({
        data: users,
      });
    })
    .catch((e) => {
      console.log(e.message);
      return res.status(405).json({ message: "Masla Ho Gya Hai" });
    });
};

const viewContent = (req, res) => {
  const token = req.headers.authorization.split(" ");
  const decoded = jwt.verify(token[1], process.env.SECRET);

  userModel
    .findOne({ email: decoded.email })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: "No User Found" });
      }
      subscriptionModel
        .findOne({ _id: user.subscription })
        .then((plan) => {
          if (!plan) {
            return res
              .status(404)
              .json({ message: "Invalid Subscription Plan" });
          }

          const path = req.originalUrl.split("/");

          if (plan.access.includes(path[path.length - 1])) {
            return res.status(200).json({ message: "Success", data: "Movie" });
          }
          return res.status(400).json({ message: "Invalid Subscription Plan" });
        })
        .catch((e) => {
          console.log(e.message);
          return res.status(400).json({ message: "Masla Ho Gya Hai" });
        });
    })
    .catch((e) => {
      console.log(e.message);
      return res.status(400).json({ message: "Masla Ho Gya Hai" });
    });
};

module.exports = {
  registerUser,
  login,
  planSubscription,
  getUsers,
  getSubscription,
  viewContent,
};
