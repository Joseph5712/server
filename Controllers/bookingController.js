const Booking = require("../Models/bookingModel.js");
const Ride = require("../Models/rideModel.js");
const User = require('../Models/userModel');

// CREAR Booking
const bookingPost = async (req, res) => {
    const { userId, rideId } = req.body;

    try {
        // Verificar si el ride existe
        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ error: "Ride not found" });
        }

        // Verificar si el usuario ya ha solicitado este ride
        const existingBooking = await Booking.findOne({ user: userId, ride: rideId });
        if (existingBooking) {
            return res.status(400).json({ error: "You have already requested this ride." });
        }

        // Crear una nueva reserva
        const booking = new Booking({
            user: userId,
            ride: rideId,
            status: 'pending' // o cualquier otro estado inicial
        });

        await booking.save();
        return res.status(201).json(booking);
    } catch (error) {
        console.error('Error creating booking:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// MOSTRAR Bookings por Driver
const bookingGet = async (req, res) => {
    const driverId = req.query.driverId;

    try {
        // Encontrar todos los rides creados por el conductor
        const rides = await Ride.find({ user: driverId });

        if (rides.length === 0) {
            return res.status(404).json({ error: "No rides found for this driver" });
        }

        // Encontrar todos los bookings correspondientes a esos rides
        const bookings = await Booking.find({ ride: { $in: rides.map(ride => ride._id) } })
            .populate('user')
            .populate('ride')
            .exec();

        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ error: "Error fetching bookings" });
        console.error("Error fetching bookings:", err);
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user').populate('ride');
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Error fetching bookings' });
    }
};


module.exports = {
    bookingPost,
    bookingGet,
    getAllBookings
};
