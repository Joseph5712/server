require('dotenv').config();
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const Session = require("../models/sessionModel");
const Ride = require("../Models/rideModel.js");
const User = require('../Models/userModel');

const THE_SECRET_KEY = '123';

// Genera y guarda una sesión
const saveSession = async function (userId, role) {
    // Usar userId y role que son pasados como parámetros
    const token = jwt.sign({ userId: userId, role: role }, THE_SECRET_KEY, { expiresIn: '24h' });

    const session = new Session({
        token: token,
        user: userId,  // Guardar el ObjectId del usuario
        role: role
    });

    return session.save();
};

// Recupera una sesión por token
const getSession = function (token) {
    return Session.findOne({ token }).populate('user');
};

// Middleware para autenticar y verificar el token
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('No token provided');
        return res.sendStatus(401);  // No autorizado si no hay token
    }

    try {
        const decoded = jwt.verify(token, THE_SECRET_KEY);  // Decodificar el token
        req.user = await User.findById(decoded.userId);  // Encontrar el usuario por su ID
        if (!req.user) {
            console.log('User not found');
            return res.sendStatus(403);  // Prohibido si no se encuentra el usuario
        }
        next();  // Continuar con la siguiente función middleware
    } catch (err) {
        console.log('Token verification failed:', err.message);
        return res.sendStatus(403);  // Prohibido si hay un error al verificar el token
    }
};

module.exports = {
    saveSession,
    getSession,
    authenticateToken
};