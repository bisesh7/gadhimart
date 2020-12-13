const mongoose = require("mongoose");

const SavedVehiclesSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true,
  },
  userIds: {
    type: Array,
    required: true,
  },
  totalSavers: {
    type: Number,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
});

const SavedVehicles = mongoose.model("savedVehicle", SavedVehiclesSchema);
module.exports = SavedVehicles;
