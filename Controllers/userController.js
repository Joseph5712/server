const User = require("../Models/userModel.js");

const userPost = async (req, res) => {

  if (req.body.date_of_birth) {
    const [year, month, day] = req.body.date_of_birth.split('-');
    req.body.date_of_birth = new Date(year, month - 1, day);
  }

  let user = new User(req.body);

  await user
    .save()
    .then((user) => {
      res.status(201); // CREATED
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


const userPatch = async (req, res) => {
  if (req.query && req.query.id) {
    try {
      const user = await User.findById(req.query.id);
      if (!user) {
        res.status(404);
        console.log("User not found");
        return res.json({ error: "User not found" });
      }

      // Actualizar las propiedades solo si están presentes en req.body
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
    res.status(400); // Bad Request
    res.json({ error: "User ID is required" });
  }
};


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


module.exports = {
  userPost,
  userGet,
  userPatch,
  userDelete
};
