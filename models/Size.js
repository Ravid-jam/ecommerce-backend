const mongoose = require("mongoose");

const sizeShema = new mongoose.Schema({
  sizeName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("size", sizeShema);
