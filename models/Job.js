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
      ref: "categories",
      required: true,
    }],
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "countries",
      required: true,
    },  
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job_level:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "jobLevel",
      required: true,
    },
    min_experience:{
         type:Number,
         require:true
    },
    max_experience:{
      type:Number,
      require:true
    },
    min_projectLength:{
      type:Number,
      require:true
 },
 max_projectLength:{
   type:Number,
   require:true
 },
  proposal:{
    type:Number,
    require:true
  }
  },
  {
    timestamps: true,
  }  
);

const PostJob = mongoose.model("PostJob", jobSchema);

module.exports = PostJob;
