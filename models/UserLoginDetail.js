const mongoose = require("mongoose");

// Create a schema
const UserLoginDetailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  lastLoginDate: {
    type: Date,
    required: true,
  },
  lastLogoutDate: {
    type: Date,
    required: false,
  },
});

const UserLoginDetail = mongoose.model(
  "userLoginDetails",
  UserLoginDetailSchema
);
module.exports = UserLoginDetail;
