const subscriptionModel = require("../Models/Subscription");

const fetchSubscriptions = (req, res) => {
  subscriptionModel
    .find()
    .then((plans) =>
      res
        .status(200)
        .json({ message: "Plans Fetched Successfully", data: plans })
    )
    .catch((e) => {
      console.log(e);
      return res.status(405).json({ message: "Database Error" });
    });
};

const addSubscriptions = (req, res) => {
  const newPlan = new subscriptionModel({
    title: req.body.title,
    price: req.body.price,
    access: req.body.access,
  });

  newPlan
    .save()
    .then((plan) =>
      res.status(200).json({ message: "Plan Added Successfully", data: plan })
    )
    .catch((e) => {
      console.log(e);
      return res.status(405).json({ message: "Database Error" });
    });
};

module.exports = { fetchSubscriptions, addSubscriptions };
