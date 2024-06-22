const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    first_name : {type: string},
    last_name : {type: string},
    email : {type: string},
    password : {type: password},
    address : {type: string},
    country: {type: string},
    state: {type: string},
    city: {type: string},
    phone_number: {type: Number}
});

module.exports = mongoose.model('user',user);