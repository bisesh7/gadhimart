const mongoose = require("mongoose");

// Create a schema
const CarMakesAndModelsSchema = new mongoose.Schema({
  make: {
    type: String,
    required: true,
  },
  models: {
    type: Array,
    required: true,
  },
});

const CarMakesAndModels = mongoose.model(
  "carMakesAndModels",
  CarMakesAndModelsSchema
);
module.exports = CarMakesAndModels;
