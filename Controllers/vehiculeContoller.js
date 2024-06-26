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
        error: "There was an error saving the user",
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
    User.find()
      .then((vehicule) => {
        res.json(vehicule);
      })
      .catch((err) => {
        res.status(433);
        res.json({ error: err });
      });
  }
};
