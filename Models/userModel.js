const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: { type: String },
    last_name: { type: String },
    cedula: { type: Number },
    birthday: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone_number: { type: Number },
    address: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    status:{type: String, enum:['pending','active'], default: 'pending'},
    role: { type: String, default:"client"} 
});

// Middleware para encriptar la contraseña antes de guardarla en la base de datos
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
