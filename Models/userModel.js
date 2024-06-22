const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    first_name : {type: String},
    last_name : {type: String},
    email : {type: String},
    password : {type: String},
    address : {type: String},
    country: {type: String},
    state: {type: String},
    city: {type: String},
    phone_number: {type: Number}
});

module.exports = mongoose.model('user',user);