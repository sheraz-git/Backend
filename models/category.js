const mongoose = require("mongoose");
const { Schema } = mongoose;
const category = new Schema({  
  category: {
    type: String,
    enum : ['Graphics & Design','Programming & Tech','Digital Marketing','Video & Animation' ,'Photography'],
    require: true,
  },

});
const categorie = mongoose.model("categorie", category);

module.exports = categorie;
