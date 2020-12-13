const mongoose = require("mongoose");

const ReportUserSchema = new mongoose.Schema({
  listingId: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
  reportedBy: {
    type: String,
    required: true,
  },
  chatSession: {
    type: String,
    required: true,
  },
  reportedUser: {
    type: String,
    required: true,
  },
  reportType: {
    type: String,
    required: true,
  },
  reportDescription: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const ReportUser = mongoose.model("reportUser", ReportUserSchema);
module.exports = ReportUser;
