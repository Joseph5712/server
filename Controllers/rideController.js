const Ride = require('../Models/rideModel');
const User = require('../Models/userModel');

const ridePost = async (req, res) => {
    const { departureFrom, arriveTo, days, time, seats, fee, vehicleDetails, userId } = req.body;

    // Verifica que todos los campos necesarios estén presentes y que userId sea un string no vacío
    if (!departureFrom || !arriveTo || !userId || typeof userId !== 'string' || userId.trim() === '') {
        return res.status(422).json({ error: "No valid data provided for ride" });
    }

    try {
        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
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
const rideGet = (req, res) => {
    if (req.query && req.query.id) {
        Ride.findById(req.query.id)
            .populate('user')
            .then((ride) => {
                res.json(ride);
            })
            .catch((err) => {
                res.status(404).json({ error: "Ride doesn't exist" });
                console.log("Error while querying the ride", err);
            });
    } else {
        Ride.find()
            .populate('user')
            .then((rides) => {
                res.json(rides);
            })
            .catch((err) => {
                res.status(422).json({ error: err });
            });
    }
};

// Update a ride
const ridePatch = (req, res) => {
    if (req.query && req.query.id) {
        Ride.findById(req.query.id, function (err, ride) {
            if (err || !ride) {
                res.status(404).json({ error: "Ride doesn't exist" });
                console.log("Error while querying the ride", err);
                return;
            }

            // Update ride fields
            ride.departureFrom = req.body.departureFrom || ride.departureFrom;
            ride.arriveTo = req.body.arriveTo || ride.arriveTo;
            ride.days = req.body.days || ride.days;
            ride.time = req.body.time || ride.time;
            ride.seats = req.body.seats || ride.seats;
            ride.fee = req.body.fee || ride.fee;
            ride.vehicleDetails.make = req.body.vehicleDetails.make || ride.vehicleDetails.make;
            ride.vehicleDetails.model = req.body.vehicleDetails.model || ride.vehicleDetails.model;
            ride.vehicleDetails.year = req.body.vehicleDetails.year || ride.vehicleDetails.year;

            ride.save(function (err) {
                if (err) {
                    res.status(422).json({ error: "There was an error saving the ride" });
                    console.log("Error while saving the ride", err);
                    return;
                }
                res.status(200).json(ride);
            });
        });
    } else {
        res.status(404).json({ error: "Ride doesn't exist" });
    }
};

// Delete a ride 
const rideDelete = (req, res) => {
    if (req.query && req.query.id) {
        Ride.findById(req.query.id, function (err, ride) {
            if (err || !ride) {
                res.status(404).json({ error: "Ride doesn't exist" });
                console.log("Error while querying the ride", err);
                return;
            }

            ride.deleteOne(function (err) {
                if (err) {
                    res.status(422).json({ error: "There was an error deleting the ride" });
                    console.log("Error while deleting the ride", err);
                    return;
                }
                res.status(204).json({});
            });
        });
    } else {
        res.status(404).json({ error: "Ride doesn't exist" });
    }
};


module.exports = {
    rideGet,
    ridePost,
    ridePatch,
    rideDelete
};