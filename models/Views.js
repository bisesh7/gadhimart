const mongoose = require("mongoose");

const ViewsSchema = new mongoose.Schema({
  ipAddresses: {
    type: Array,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
  vehicleId: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    required: true,
  },
});

const Views = mongoose.model("views", ViewsSchema);
module.exports = Views;
