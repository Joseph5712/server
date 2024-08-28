const express = require('express');
const passport = require('passport');
const router = express.Router();

// Iniciar la autenticación con Google para registro
router.get('/auth/google/register', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Manejar la redirección después de la autenticación con Google para registro
router.get('/auth/google/register/callback',
    passport.authenticate('google', { failureRedirect: 'http://127.0.0.1:5501/client/auth/login.html' }),
    (req, res) => {
        // Autenticación exitosa, redirige a la página de registro
        res.redirect('/register-success'); // Redirige a la página de éxito del registro o perfil
    }
);

// Iniciar la autenticación con Google para inicio de sesión
router.get('/auth/google/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Manejar la redirección después de la autenticación con Google para inicio de sesión
router.get('/auth/google/login/callback',
    passport.authenticate('google', { failureRedirect: 'http://127.0.0.1:5501/client/auth/login.html' }),
    (req, res) => {
        // Autenticación exitosa, redirige a la página de inicio o perfil
        res.redirect('/dashboard'); // Redirige al dashboard o página de inicio
    }
);

module.exports = router;
