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



module.exports = {
    rideGet,
    ridePost,
    ridePatch,
    rideDelete
};