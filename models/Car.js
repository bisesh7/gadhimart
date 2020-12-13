const mongoose = require("mongoose");

// Create a schema
const CarSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  carDetails: {
    type: Object,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Car = mongoose.model("car", CarSchema);
module.exports = Car;
