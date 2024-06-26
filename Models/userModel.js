const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    first_name : {type: String},
    last_name : {type: String},
    cedula : {type: Number},
    birthday : {type: Date},
    email : {type: String},
    password : {type: String},
    phone_number: {type: Number},
    address : {type: String},
    country : {type: String},
    state : {type : String},
    city: {type: String},
    role: {type: String} 
});

module.exports = mongoose.model('User',user);