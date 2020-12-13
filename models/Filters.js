const mongoose = require("mongoose");

// Create a schema
const FiltersSchema = new mongoose.Schema({
  transmissions: {
    type: Array,
    required: false,
  },
  bodyTypes: {
    type: Array,
    required: false,
  },
  conditions: {
    type: Array,
    required: false,
  },
  fuelTypes: {
    type: Array,
    required: false,
  },
  driveTrains: {
    type: Array,
    required: false,
  },
  colors: {
    type: Array,
    required: false,
  },
  seats: {
    type: Array,
    required: false,
  },
  doors: {
    type: Array,
    required: false,
  },
  featuresFrontEnd: {
    type: Array,
    required: false,
  },
  featuresDatabase: {
    type: Array,
    required: false,
  },
  vehicleType: {
    type: String,
    required: true,
  },
});

const Filters = mongoose.model("filters", FiltersSchema);
module.exports = Filters;
