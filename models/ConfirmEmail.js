const mongoose = require("mongoose");

const ConfirmEmailSchema = new mongoose.Schema({
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

const ConfirmEmail = mongoose.model("confirmEmail", ConfirmEmailSchema);
module.exports = ConfirmEmail;
