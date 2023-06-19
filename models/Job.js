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
    },
    joblevel:{
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
  Propsoal:{
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
