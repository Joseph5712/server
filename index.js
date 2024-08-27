require('dotenv').config();



const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const bcrypt = require('bcrypt');
const crypto = require("crypto");
// database connection
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb+srv://molinajesus2003:weJyz3uFbpRRcg2M@cluster0.orvrvph.mongodb.net/DB_Aventados");

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

app.get('/api/verify/:token', async (req, res) => {
  
  try {
    const  {token}  = req.params;
    
    // Verificar el token
    const decoded = jwt.verify(token, 'SECRET_KEY');
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




const {
  rideGet,
  ridePost,
  ridePatch,
  rideDelete
} = require("./Controllers/rideController.js");

// Importar controladores
const { 
  saveSession,
  authenticateToken 
} = require("./Controllers/sessionController.js");

// Ride routes
app.post("/api/rides", authenticateToken, ridePost);
app.get("/api/rides", authenticateToken, rideGet);
app.patch("/api/rides", ridePatch);
app.delete("/api/rides", rideDelete);


const {
  userPost,
  userGet,
  userDelete,
  userPatch,
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

// Booking routes
app.post("/api/bookings", authenticateToken, bookingPost);
app.get("/api/bookings", authenticateToken, bookingGet);
app.get("/api/bookingsClient", authenticateToken, getAllBookings);



app.listen(3001, () => console.log(`Example app listening on port 3001!`))



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

//----

