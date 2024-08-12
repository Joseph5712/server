const Booking = require("../Models/bookingModel.js");
const Ride = require("../Models/rideModel.js");
const User = require('../Models/userModel');

// CREAR Booking
const bookingPost = async (req, res) => {
    const { userId, rideId } = req.body;

    try {
        // Verificar si el ride existe
        const ride = await Ride.findById(rideId);
        console.log(rideId);
        if (!ride) {
            return res.status(404).json({ error: "Ride not found" });
        }

        // Crear el nuevo booking
        const booking = new Booking({
            user: userId,
            ride: rideId,
            departureFrom: ride.departureFrom,
            arriveTo: ride.arriveTo
        });

        const savedBooking = await booking.save();

        res.status(201).json(savedBooking);
    } catch (err) {
        res.status(422).json({ error: "Error while saving the booking" });
        console.error("Error while saving the booking:", err);
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

module.exports = {
    bookingPost,
    bookingGet
};
