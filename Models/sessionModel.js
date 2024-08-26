const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    token: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Cambiado a ObjectId para referenciar al usuario
    role: { type: String, required: true }   // Añadir campo 'role'
});

module.exports = mongoose.model('Session', sessionSchema);
