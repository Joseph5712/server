const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    token: { type: String, required: true },
    user: { type: String, required: true },  // Cambiado de 'user' a 'email' para mayor claridad
    role: { type: String, required: true }   // Añadir campo 'role'
});

module.exports = mongoose.model('Session', sessionSchema);
