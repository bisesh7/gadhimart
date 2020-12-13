const mongoose = require("mongoose");

// Create a schema
const ChatSessionSchema = new mongoose.Schema({
  vehicleType: {
    type: String,
    required: true,
  },
  listingId: {
    type: String,
    required: true,
  },
  uniqueId: {
    type: String,
    required: true,
  },
  usersInvolved: {
    type: Array,
    required: true,
  },
  messages: {
    type: Array,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const ChatSession = mongoose.model("chatSessions", ChatSessionSchema);
module.exports = ChatSession;
