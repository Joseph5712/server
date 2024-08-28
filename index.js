require('dotenv').config();
require('./Controllers/passport.js'); // Importa la configuración de Passport

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const app = express();
const bcrypt = require('bcrypt');
const crypto = require("crypto");
// database connection
const mongoose = require("mongoose");
<<<<<<< HEAD
const db = mongoose.connect("mongodb+srv://josephme5712:9a1Ao5AEy09ewGbC@cluster0.m5sfesz.mongodb.net/DB_Aventados");

=======
const db = mongoose.connect("mongodb+srv://molinajesus2003:weJyz3uFbpRRcg2M@cluster0.orvrvph.mongodb.net/DB_Aventados");
const authRoutes = require('./auth.js');
>>>>>>> b686ea024ec6108fab1f90dabe5ee180457a8ded
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

<<<<<<< HEAD
const THE_SECRET_KEY = '123';

=======
>>>>>>> b686ea024ec6108fab1f90dabe5ee180457a8ded

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

app.get('/api/verify/:token', async (req, res) => {
  
  try {
    const  {token}  = req.params;
    
    // Verificar el token
    const decoded = jwt.verify(token, THE_SECRET_KEY);
    // Buscar el usuario por ID
    const user = await User.findById(decoded.userID);

    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    if (user.status === 'active') {
      return res.status(400).json({ message: 'El usuario ya está activo' });
    }

    user.status = 'active';
    await user.save();
    
    res.redirect('http://127.0.0.1:5501//client/auth/login.html');
  } catch (error) {
    console.error('Error en la verificación de cuenta:', error.message);
    res.status(400).json({ message: 'Enlace de verificación inválido o expirado' });
  }
});

<<<<<<< HEAD
// Endpoint de login usando JWT
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

      // Genera y guarda la sesión con el token y el userId del usuario
      const session = await saveSession(user._id, user.role);
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

=======
// Configuración de la sesión
app.use(session({
  secret: '123',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// Middleware para analizar el cuerpo de las solicitudes POST
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/',authRoutes);
>>>>>>> b686ea024ec6108fab1f90dabe5ee180457a8ded

const {
  rideGet,
  ridePost,
  ridePatch,
<<<<<<< HEAD
  rideDelete,
  getRidesByDriver
=======
  rideDelete
>>>>>>> b686ea024ec6108fab1f90dabe5ee180457a8ded
} = require("./Controllers/rideController.js");

// Importar controladores
const { 
  saveSession,
  authenticateToken 
} = require("./Controllers/sessionController.js");

// Ride routes
app.post("/api/rides", authenticateToken, ridePost);
app.get("/api/rides", authenticateToken, rideGet);
<<<<<<< HEAD
app.get("/api/rides", authenticateToken, getRidesByDriver);
=======
>>>>>>> b686ea024ec6108fab1f90dabe5ee180457a8ded
app.patch("/api/rides", authenticateToken,ridePatch);
app.delete("/api/rides", authenticateToken,rideDelete);


const {
  userPost,
  userGet,
  userDelete,
  userPatch,
} = require("./Controllers/userController.js");

const {
  bookingPost,
  bookingGet,
<<<<<<< HEAD
  getAllBookings,
  getClientBookings
=======
  getAllBookings
>>>>>>> b686ea024ec6108fab1f90dabe5ee180457a8ded
} = require("./Controllers/bookingController.js");



// User routes
app.post("/api/user", userPost);
app.get("/api/user",userGet);
app.delete("/api/user",userDelete);
app.patch("/api/user",userPatch);

// Booking routes
<<<<<<< HEAD
app.post('/api/bookings', authenticateToken, bookingPost);
app.get("/api/bookings", authenticateToken, bookingGet);
app.get("/api/bookingsClient", authenticateToken, getAllBookings);
app.get("/api/bookings", authenticateToken, getClientBookings);
=======
app.post("/api/bookings", authenticateToken, bookingPost);
app.get("/api/bookings", authenticateToken, bookingGet);
app.get("/api/bookingsClient", authenticateToken, getAllBookings);
>>>>>>> b686ea024ec6108fab1f90dabe5ee180457a8ded



app.listen(3001, () => console.log(`Example app listening on port 3001!`))



<<<<<<< HEAD


=======
>>>>>>> b686ea024ec6108fab1f90dabe5ee180457a8ded
//----

