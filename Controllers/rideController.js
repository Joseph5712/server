const Ride = require("../Models/rideModel.js");

// Create a new ride (POST)
const ridePost = async (req, res) => {
    let ride = new Ride();

    ride.departureFrom = req.body.departureFrom;
    ride.arriveTo = req.body.arriveTo;
    ride.days = req.body.days;
    ride.time = req.body.time;
    ride.seats = req.body.seats;
    ride.fee = req.body.fee;
    ride.vehicleDetails.make = req.body.vehicleDetails.make;
    ride.vehicleDetails.model = req.body.vehicleDetails.model;
    ride.vehicleDetails.year = req.body.vehicleDetails.year;

    if (ride.departureFrom && ride.arriveTo) {
        await ride
            .save()
            .then((data) => {
                res.status(201); // CREATED
                res.header({
                    location: `/api/rides/?id=${data.id}`,
                });
                res.json(data);
            })
            .catch((err) => {
                res.status(422);
                console.log("Error while saving the ride", err);
                res.json({
                    error_code: 1233,
                    error: "There was an error saving the ride",
                });
            });
    } else {
        res.status(422);
        console.log("Error while saving the ride");
        res.json({
            error: "No valid data provided for ride",
        });
    }
};

// Get all rides or a specific ride by ID (GET)
const rideGet = (req, res) => {
    if (req.query && req.query.id) {
        Ride.findById(req.query.id)
            .then((ride) => {
                res.json(ride);
            })
            .catch((err) => {
                res.status(404);
                console.log("Error while querying the ride", err);
                res.json({ error: "Ride doesn't exist" });
            });
    } else {
        Ride.find()
            .then((rides) => {
                res.json(rides);
            })
            .catch((err) => {
                res.status(422);
                res.json({ error: err });
            });
    }
};

// Update a ride by ID (PATCH)
const ridePatch = (req, res) => {
    if (req.query && req.query.id) {
        Ride.findById(req.query.id, function (err, ride) {
            if (err || !ride) {
                res.status(404);
                console.log("Error while querying the ride", err);
                res.json({ error: "Ride doesn't exist" });
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
                    res.status(422);
                    console.log("Error while saving the ride", err);
                    res.json({
                        error: "There was an error saving the ride",
                    });
                    return;
                }
                res.status(200); // OK
                res.json(ride);
            });
        });
    } else {
        res.status(404);
        res.json({ error: "Ride doesn't exist" });
    }
};

// Delete a ride by ID (DELETE)
const rideDelete = (req, res) => {
    if (req.query && req.query.id) {
        Ride.findById(req.query.id, function (err, ride) {
            if (err || !ride) {
                res.status(404);
                console.log("Error while querying the ride", err);
                res.json({ error: "Ride doesn't exist" });
                return;
            }

            ride.deleteOne(function (err) {
                if (err) {
                    res.status(422);
                    console.log("Error while deleting the ride", err);
                    res.json({
                        error: "There was an error deleting the ride",
                    });
                    return;
                }
                res.status(204); // No content
                res.json({});
            });
        });
    } else {
        res.status(404);
        res.json({ error: "Ride doesn't exist" });
    }
};

module.exports = {
    rideGet,
    ridePost,
    ridePatch,
    rideDelete,
};
