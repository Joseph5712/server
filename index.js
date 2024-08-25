require('dotenv').config();

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const crypto = require("crypto");
// database connection
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb+srv://josephme5712:9a1Ao5AEy09ewGbC@cluster0.m5sfesz.mongodb.net/DB_Aventados");

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

// Importar modelos
const Ride = require('./Models/rideModel');
const User = require('./Models/userModel');
const Booking = require('./Models/bookingModel');

// Endpoint para iniciar sesión
/*app.post('/api/login', async (req, res) => {
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
});*/

// Endpoint para buscar rides
app.post("/api/rides/search", async (req, res) => {
  const { searchInput, from, to, days } = req.body;

  try {
    // Construir la consulta de busqueda
    let query = {};

    if (searchInput) {
      query.$text = { $search: searchInput };
    }
    if (from) {
      query.departureFrom = from;
    }
    if (to) {
      query.arriveTo = to;
    }
    if (days && days.length > 0) {
      query.days = { $in: days };
    }

    // Ejecutar la consulta en la base de datos
    const rides = await Ride.find(query).populate('user').exec();

    // Enviar los resultados como respuesta
    res.status(200).json(rides);
  } catch (error) {
    console.error('Error searching rides:', error);
    res.status(500).json({ error: 'Error searching rides' });
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
  userPatch,
  getUserById,
  userVerify
} = require("./Controllers/userController.js");

const {
  bookingPost,
  bookingGet,
  getAllBookings
} = require("./Controllers/bookingController.js");

// User routes
app.post("/api/user", userPost);
app.get("/api/user",userGet);
app.delete("/api/user",userDelete);
app.patch("/api/user",userPatch);
app.get("/api/user/:userId", getUserById);
app.get("/api/user/?token=", userVerify);

// Booking routes
app.post("/api/bookings", bookingPost);
app.get("/api/bookings", bookingGet);
app.get("/api/bookingsClient", getAllBookings);



app.listen(3001, () => console.log(`Example app listening on port 3001!`))


const { saveSession, getSession } = require("./Controllers/sessionController.js");



// Session-based login route
app.post("/api/session", async function (req, res) {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
          return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      // Genera y guarda la sesión con el token y el rol del usuario
      const session = await saveSession(user.email, user.role);  // Pasamos el rol del usuario
      if (!session) {
          return res.status(500).json({ error: 'Hubo un error al crear la sesión' });
      }

      // Retorna el token, el nombre del usuario y el rol
      res.status(201).json({ token: session.token, user: user.first_name, role: user.role });
  } catch (error) {
      console.error('Error interno del servidor:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//----

