require('dotenv').config();
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const Session = require("../models/sessionModel");
const Ride = require("../Models/rideModel.js");
const User = require('../Models/userModel');
const Booking = require('../Models/bookingModel.js');

// CREAR Booking
const bookingPost = async (req, res) => {

    const THE_SECRET_KEY = '123';
    try {
        // Verificar el token
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Decodificar el token para obtener el userId
        let userId;
        try {
            const decodedToken = jwt.verify(token, THE_SECRET_KEY);
            userId = decodedToken.userId;
        } catch (error) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const { rideId } = req.body;

        console.log("User ID:", userId);
        console.log("Ride ID:", rideId);

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
            status: 'pending'
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
    const driverId = req.user._id;  // Obtener el driverId del token decodificado

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

const getAllBookings = async (req, res) => { //filtra los bookings del usuario que este logueado
    try {
        const userId = req.user._id;  // Obtener el userId del usuario autenticado

        // Encontrar todos los bookings del usuario autenticado
        const bookings = await Booking.find({ user: userId }).populate('user').populate('ride');

        if (bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this user' });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Error fetching bookings' });
    }
};

const getClientBookings = async (req, res) => {
    try {
        const userId = req.user._id; // Obtener el ID del usuario autenticado desde el token

        // Encontrar todos los bookings asociados a este usuario
        const bookings = await Booking.find({ user: userId }).populate('ride');

        if (!bookings.length) {
            return res.status(404).json({ message: 'No bookings found for this user' });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    bookingPost,
    bookingGet,
    getAllBookings,
    getClientBookings
};
