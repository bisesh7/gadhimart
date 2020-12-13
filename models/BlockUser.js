const mongoose = require("mongoose");

const BlockUserSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  blockedUsers: {
    type: Array,
    required: true,
  },
  totalBlocked: {
    type: Number,
    required: true,
  },
});

const BlockUser = mongoose.model("blockUser", BlockUserSchema);
module.exports = BlockUser;
