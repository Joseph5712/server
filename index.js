const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
// database connection
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb+srv://josephme5712:9a1Ao5AEy09ewGbC@cluster0.m5sfesz.mongodb.net/DB_Aventados");
const User = require('./Models/userModel.js');

// parser for the request body (required for the POST and PUT methods)
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.json());

// check for cors
const cors = require("cors");
app.use(cors({
  origin: '*',
  methods: "*"
}));

// Endpoint para iniciar sesión
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Received login request:', { email, password });

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log('Usuario no encontrado:', email);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    console.log('Usuario encontrado:', user);

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Resultado de la comparación de contraseña:', passwordMatch);
    console.log('Resultado de la comparación de contraseña:', password,"+",user.password);

    if (!passwordMatch) {
      console.log('Contraseña incorrecta para el usuario:', email);
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    console.log('Inicio de sesión exitoso para el usuario:', email);
    res.status(200).json({ message: 'Inicio de sesión exitoso', user });
  } catch (error) {
    console.error('Error interno del servidor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

const {
  rideGet,
  ridePost,
  ridePatch,
  rideDelete
} = require("./Controllers/rideController.js");

// Ride routes
app.post("/api/rides", ridePost);
app.get("/api/rides", rideGet);
app.patch("/api/rides", ridePatch);
app.delete("/api/rides", rideDelete);


const {
  userPost,
  userGet,
  userDelete,
  userPatch
} = require("./Controllers/userController.js");

// User routes
app.post("/api/user", userPost);
app.get("/api/user",userGet);
app.delete("/api/user",userDelete);
app.patch("/api/user",userPatch);


app.listen(3001, () => console.log(`Example app listening on port 3001!`))