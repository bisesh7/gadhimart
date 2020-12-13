const mongoose = require("mongoose");

// Create a schema
const MotorcycleSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  details: {
    type: Object,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Motorcycle = mongoose.model("motorcycle", MotorcycleSchema);
module.exports = Motorcycle;
