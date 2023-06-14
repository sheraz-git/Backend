const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    service_Title: {
      type: String,
      required: true,
    },
    minimum_budget: {
      type: String,
      required: true,
    },
    service_Description: {
      type: String,
      required: true,
    },
    category: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "categorie",
      required: true,
    }],
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "countrie",
      required: true,
    },  
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }  

  },
  {
    timestamps: true,
  }  
);

const PostJob = mongoose.model("PostJob", jobSchema);

module.exports = PostJob;
