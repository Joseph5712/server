const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rideSchema = new Schema({
    departureFrom: {
        type: String,
        required: true
    },
    arriveTo: {
        type: String,
        required: true
    },
    days: {
        mon: { type: Boolean, default: false },
        tue: { type: Boolean, default: false },
        wed: { type: Boolean, default: false },
        thu: { type: Boolean, default: false },
        fri: { type: Boolean, default: false },
        sat: { type: Boolean, default: false },
        sun: { type: Boolean, default: false }
    },
    time: {
        type: String,
        required: true
    },
    seats: {
        type: Number,
        required: true,
        min: 1
    },
    fee: { //tarifa
        type: Number,
        required: true,
        min: 0
    }
});
module.exports = mongoose.model('Ride', rideSchema);
