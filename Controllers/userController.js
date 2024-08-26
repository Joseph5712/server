const User = require("../Models/userModel.js");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const mailerSend = new MailerSend({
  apiKey: 'mlsn.2e27dddbc79097aa82296d43f56bb3d5055494d27629e24ccf5e7cf507abdef9',
});

const userPost = async (req, res) => {
  let user = new User(req.body);

  await user
    .save()
    .then(async (user) => {
      // Generar el token JWT usando el ID del usuario guardado
      const token = jwt.sign({ userID: user._id }, "SECRET_KEY", {
        expiresIn: "1h",
      });
      console.log(token);

      // Configurar el correo electrónico
      const emailParams = new EmailParams()
        .setFrom(new Sender("no-reply@trial-neqvygmxyjjl0p7w.mlsender.net", "Aventados"))
        .setTo([new Recipient(user.email, user.first_name + " " + user.last_name)])
        .setSubject("Verifica tu cuenta")
        .setHtml(`
          <p>Por favor, haz click en el siguiente enlace para verificar tu cuenta:</p>
          <a href="http://localhost:3001/verify/${token}">Verificar cuenta</a>
        `);

      // Intentar enviar el correo de verificación
      try {
        const response = await mailerSend.email.send(emailParams);
        console.log("Correo de verificación enviado:", response);

        // Establecer la cabecera de ubicación y enviar la respuesta final
        res.status(201).header({
          location: `/api/user/?id=${user._id}`,
        }).json({
          message: "Registro exitoso. Por favor, revisa tu correo para verificar tu cuenta.",
        });
      } catch (error) {
        console.error("Error enviando el correo de verificación:", error);
        res.status(500).json({ message: "Error enviando el correo de verificación." });
      }
    })
    .catch((err) => {
      console.log("Error al guardar el usuario", err);
      res.status(422).json({
        error: "Hubo un error al guardar el usuario",
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


module.exports = {
  userPost,
  userGet,
  userPatch,
  userDelete
};
