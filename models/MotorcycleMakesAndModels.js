const mongoose = require("mongoose");

// Create a schema
const MotorcycleMakesAndModelsSchema = new mongoose.Schema({
  make: {
    type: String,
    required: true,
  },
  models: {
    type: Array,
    required: true,
  },
});

const MotorcycleMakesAndModels = mongoose.model(
  "motorcycleMakesAndModels",
  MotorcycleMakesAndModelsSchema
);
module.exports = MotorcycleMakesAndModels;
