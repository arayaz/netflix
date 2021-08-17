const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: String,
  subscription: {
    type: Schema.Types.ObjectId,
    ref: "Subscription",
  },
  nextPaymentDate: {
    type: Date,
    required: true,
  },
  nextPaymentAmount: {
    type: Number,
    required: true,
  },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
