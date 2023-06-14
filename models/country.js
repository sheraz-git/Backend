const mongoose = require("mongoose");

const { Schema } = mongoose;
const country = new Schema(
  {
    country: {
      type: String,
      require: true,
      default: null,
      
    },
  },
  { timestamps: true }

);

const countries = mongoose.model("countrie", country);

module.exports = countries;