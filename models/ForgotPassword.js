const mongoose = require("mongoose");

const ForgotPasswordSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  uuid: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  userId: {
    type: String,
    required: true,
  },
});

const ForgotPassword = mongoose.model("forgotPassword", ForgotPasswordSchema);
module.exports = ForgotPassword;
