const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicule = new Schema({
  own: { 
    type: String, 
    required: true 
},
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
    min: 1886, // Year of the first car
  },
});

module.exports = mongoose.model("Vehicule", vehicule);
