const mongoose = require("mongoose");

const SavedSearchSchema = new mongoose.Schema({
  userIds: {
    type: Array,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
  filters: {
    type: JSON,
    required: true,
  },
  totalSaved: {
    type: Number,
    required: true,
  },
});

const SavedSearch = mongoose.model("savedSearch", SavedSearchSchema);
module.exports = SavedSearch;
