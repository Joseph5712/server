const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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

// Encrypt the password before saving the user model
user.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

module.exports = mongoose.model('User',user);