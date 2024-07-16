const User = require("../Models/userModel.js");


// CREATED
const userPost = async (req, res) => {
  let user = new User(req.body);
  await user
    .save()
    .then((user) => {
      res.status(201); 
      res.header({
        location: `/api/user/?id=${user.id}`,
      });
      res.json(user);
    })
    .catch((err) => {
      res.status(422);
      console.log("error while saving the user", err);
      res.json({
        error: "There was an error saving the user",
      });
    });
};

//mostrar
const userGet = (req, res) => {
  if (req.query && req.query.id) {
    User.findById(req.query.id)
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res.status(404);
        console.log("error while queryting the user", err);
        res.json({ error: "user does not exist" });
      });
  } else {
    User.find()
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res.status(433);
        res.json({ error: err });
      });
  }
};

//edit
const userPatch = async (req, res) => {
  if (req.query && req.query.id) {
    try {
      const user = await User.findById(req.query.id);
      if (!user) {
        res.status(404);
        console.log("User not found");
        return res.json({ error: "User not found" });
      }
      user.first_name = req.body.first_name || user.first_name;
      user.last_name = req.body.last_name || user.last_name;
      user.cedula = req.body.cedula || user.cedula;
      user.email = req.body.email || user.email;
      user.birthday = req.body.birthday || user.birthday;
      user.password = req.body.password || user.password;
      user.phone_number = req.body.phone_number || user.phone_number;
      user.address = req.body.address || user.address;
      user.country = req.body.country || user.country;
      user.state = req.body.state || user.state;
      user.city = req.body.city || user.city;

      const updatedUser = await user.save();

      res.status(200); // OK
      res.header({
        location: `/api/user/?id=${updatedUser.id}`,
      });
      res.json(updatedUser);
    } catch (err) {
      res.status(500);
      console.log("Error while querying or saving the user", err);
      res.json({
        error: "There was an error updating the user",
      });
    }
  } else {
    res.status(400);
    res.json({ error: "User ID is required" });
  }
};

//delete
const userDelete = async (req, res) => {
  if (req.query && req.query.id) {
    try {
      const user = await User.findById(req.query.id);
      if (!user) {
        res.status(404);
        console.log("User not found");
        return res.json({ error: "User not found" });
      }

      await User.deleteOne({ _id: req.query.id });

      res.status(200); // OK
      return res.json({ message: "User successfully deleted" });
    } catch (err) {
      res.status(500);
      console.log("Error while querying or deleting the user", err);
      return res.json({
        error: "There was an error deleting the user",
      });
    }
  } else {
    res.status(400); // Bad Request
    return res.json({ error: "User ID is required" });
  }
};

//mostrar usuario por id
const getUserById = (req, res) => {
  const userId = req.params.userId; // Obtener el ID del usuario de los parámetros de la ruta

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.json(user);
      }
    })
    .catch((err) => {
      console.error("Error while fetching user:", err);
      res.status(500).json({ error: "Error fetching user" });
    });
};

module.exports = {
  userPost,
  userGet,
  userPatch,
  userDelete,
  getUserById 
};
