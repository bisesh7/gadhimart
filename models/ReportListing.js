const mongoose = require("mongoose");

const ReportListingSchema = new mongoose.Schema({
  listingId: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
  reportedByEmail: {
    type: String,
    required: true,
  },
  reportType: {
    type: String,
    required: true,
  },
  reportDescription: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

const ReportListing = mongoose.model("reportListing", ReportListingSchema);
module.exports = ReportListing;
