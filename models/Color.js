const moongoose = require("mongoose");

const colorScheme = new moongoose.Schema({
  colorName: {
    type: String,
    required: true,
  },
  colorCode: {
    type: String,
    required: true,
  },
});

module.exports = moongoose.model("Color", colorScheme);
