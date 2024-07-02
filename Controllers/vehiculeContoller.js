const Vehicule = require("../Models/vehiculeModel.js");

const vehidulePost = async (req, res) => {
  let vehicule = new Vehicule(req.body);

  await vehicule
    .save()
    .then((vehicule) => {
      res.status(201);
      res.header({
        location: `/api/vehicule/?id=${vehicule.id}`,
      });
      res.json(vehicule);
    })
    .catch((err) => {
      res.status(442);
      console.log("error while saving the vehicule", err);
      res.json({
        error: "There was an error saving the Vehicule",
      });
    });
};

const vehiculeGet = (req, res) => {
  if (req.query && req.query.id) {
    Vehicule.findById(req.query.id)
      .then((vehicule) => {
        res.json(vehicule);
      })
      .catch((err) => {
        res.status(404);
        console.log("error while queryting the vehicule", err);
        res.json({ error: "vehicule does not exist" });
      });
  } else {
    Vehicule.find()
      .then((vehicule) => {
        res.json(vehicule);
      })
      .catch((err) => {
        res.status(433);
        res.json({ error: err });
      });
  }
};

const vehiculePatch = async (req, res) => {
  if (req.query && req.query.id) {
    try {
      const vehicule = await Vehicule.findById(req.query.id);
      if (!vehicule) {
        res.status(404);
        console.log("Vehicule not found");
        res.json({ error: "Vehicule not found" });
      }
      vehicule.own = req.body.own || vehicule.own;
      vehicule.make = req.body.make || vehicule.make;
      vehicule.model = req.body.model || vehicule.model;
      vehicule.year = req.body.year || vehidulePost.year;

      const updateVehicule = await vehicule.save();
      res.status(200);
      res.header({
        location: `/api/Vehicule/?id=${updatedVehicule.id}`,
      });
      res.json(updateVehicule);
    } catch (err) {
      res.status(500);
      console.log("Error while querying or updating the vehicule", err);
      res.json({
        error: "There was an error updating the vehicule",
      });
    }
  } else {
    res.status(400);
    res.json({ error: "Vehicule ID is required" });
  }
};


const vehiculeDelete = async (req, res) => {
  if (req.query && req.query.id) {
    try {
      const vehicule = await Vehicule.findById(req.query.id);
      if (!vehicule) {
        res.status(404);
        console.log("Vehicule not found");
        return res.json({ error: "Vehicule not found" });
      }

      await Vehicule.deleteOne({ _id: req.query.id });

      res.status(200); // OK
      return res.json({ message: "Vehicule successfully deleted" });
    } catch (err) {
      res.status(500);
      console.log("Error while querying or deleting the Vehicule", err);
      return res.json({
        error: "There was an error deleting the Vehicule",
      });
    }
  } else {
    res.status(400); // Bad Request
    return res.json({ error: "Vehicule ID is required" });
  }
};

module.exports = {
  vehiculePost,
  vehiculeGet,
  vehiculePatch,
  vehiculeDelete
};
