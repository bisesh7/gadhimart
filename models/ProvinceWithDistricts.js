const mongoose = require("mongoose");

// Create a schema
const ProvinceWithDistrictsSchema = new mongoose.Schema({
  province: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  districts: {
    type: Array,
    required: true,
  },
});

const ProvinceWithDistricts = mongoose.model(
  "provinceWithDistricts",
  ProvinceWithDistrictsSchema
);
module.exports = ProvinceWithDistricts;
