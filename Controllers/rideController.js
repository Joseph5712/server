require('dotenv').config();
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const Session = require("../models/sessionModel");
const Ride = require("../Models/rideModel.js");
const User = require('../Models/userModel');

const ridePost = async (req, res) => {
    const { departureFrom, arriveTo, days, time, seats, fee, vehicleDetails } = req.body;
    const userId = req.user._id;  // Obtener el userId del token decodificado

    // Verifica que todos los campos necesarios estén presentes
    if (!departureFrom || !arriveTo || !userId) {
        return res.status(422).json({ error: "No valid data provided for ride" });
    }

    try {
        // Crear el objeto ride
        const ride = new Ride({
            departureFrom,
            arriveTo,
            days,
            time,
            seats,
            fee,
            vehicleDetails,
            user: userId // Asignar el id del usuario al ride
        });

        // Guardar el ride en la base de datos
        const data = await ride.save();
        return res.status(201).header({ location: `/api/rides/?id=${data.id}` }).json(data);
    } catch (err) {
        console.error("Error while saving the ride", err);
        return res.status(422).json({
            error_code: 1233,
            error: "There was an error saving the ride"
        });
    }
};





// Get all rides or a specific ride by ID (GET)
const rideGet = async (req, res) => {
    try {
        const userId = req.user._id; // Obtener el userId del usuario autenticado desde req.user

        if (req.query && req.query.id) {
            // Si se proporciona un ID específico, buscar ese ride
            const ride = await Ride.findById(req.query.id).populate('user'); // Cambié 'Ride' a 'ride' en la respuesta
            if (!ride) {
                return res.status(404).json({ error: "Ride doesn't exist" });
            }
            return res.json(ride); // Corrige aquí para devolver el ride encontrado
        } else {
            // Si no se proporciona un ID, obtener todos los rides del usuario autenticado
            const rides = await Ride.find({ user: userId }).populate('user');
            if (rides.length === 0) {
                return res.status(404).json({ message: 'No rides found for this user' });
            }
            return res.json(rides);
        }
    } catch (err) {
        console.error("Error while querying the rides", err);
        return res.status(422).json({ error: err });
    }
};

// Update a ride
const ridePatch = async (req, res) => {
    if (req.query && req.query.id) {
        try {
            const ride = await Ride.findById(req.query.id);
            if (!ride) {
                res.status(404).json({ error: "Ride doesn't exist" });
                console.log("Ride doesn't exist");
                return;
            }

            // Actualizar campos del ride
            ride.departureFrom = req.body.departureFrom || ride.departureFrom;
            ride.arriveTo = req.body.arriveTo || ride.arriveTo;
            ride.days = req.body.days || ride.days;
            ride.time = req.body.time || ride.time;
            ride.seats = req.body.seats || ride.seats;
            ride.fee = req.body.fee || ride.fee;

            // Manejar vehicleDetails de manera segura
            const { make, model, year } = req.body.vehicleDetails || {};
            ride.vehicleDetails.make = make || ride.vehicleDetails.make;
            ride.vehicleDetails.model = model || ride.vehicleDetails.model;
            ride.vehicleDetails.year = year || ride.vehicleDetails.year;

            await ride.save();
            res.status(200).json(ride);
        } catch (err) {
            res.status(422).json({ error: "There was an error saving the ride" });
            console.log("Error while saving the ride", err);
        }
    } else {
        res.status(404).json({ error: "Ride doesn't exist" });
    }
};



// Delete a ride 

const rideDelete = async (req, res) => {
    if (req.query && req.query.id) {
      try {
        const ride = await Ride.findById(req.query.id);
        if (!ride) {
          res.status(404);
          console.log("Ride not found");
          return res.json({ error: "Ride not found" });
        }
  
        await Ride.deleteOne({ _id: req.query.id });
  
        res.status(200); // OK
        return res.json({ message: "Ride successfully deleted" });
      } catch (err) {
        res.status(500);
        console.log("Error while querying or deleting the ride", err);
        return res.json({
          error: "There was an error deleting the ride",
        });
      }
    } else {
      res.status(400); // Bad Request
      return res.json({ error: "Ride ID is required" });
    }
  };

  const getRidesByDriver = async (req, res) => {
    try {
        const userId = req.user._id; // El ID del usuario autenticado se obtiene del token
        const rides = await Ride.find({ user: userId });

        if (rides.length === 0) {
            return res.status(404).json({ message: 'No rides found for this driver' });
        }

        res.status(200).json(rides);
    } catch (error) {
        console.error('Error fetching rides:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



module.exports = {
    rideGet,
    ridePost,
    ridePatch,
    rideDelete,
    getRidesByDriver
};