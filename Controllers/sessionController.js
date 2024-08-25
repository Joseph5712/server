require('dotenv').config();
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const Session = require("../models/sessionModel");

const THE_SECRET_KEY = '123';

// Genera y guarda una sesión
const saveSession = async function (email, role) {
    //console.log('Secret Key:', process.env.SECRET_KEY); // Añadir esta línea para depurar
    //const secret = process.env.SECRET_KEY;
    const token = jwt.sign({ email, role }, THE_SECRET_KEY, { expiresIn: '1h' });

    const session = new Session();
    session.token = token;
    session.user = email;
    session.role = role;

    return session.save();
};

// Recupera una sesión por token
const getSession = function (token) {
    return Session.findOne({ token });
};

module.exports = {
    saveSession,
    getSession
}