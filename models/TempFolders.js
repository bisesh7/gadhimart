const mongoose = require("mongoose");

const TempFoldersSchema = new mongoose.Schema({
  uniqueId: {
    type: Array,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: String,
    required: true,
  },
});

const TempFolders = mongoose.model("tempFolder", TempFoldersSchema);

module.exports = TempFolders;
