const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const router = express.Router();

// Login Page
router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        return res.redirect('/user/home');
    }
    res.render('pages/login');
});

// Handle Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.render('pages/login', { error: 'User not found' });
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (isPasswordMatch) {
            req.session.loggedIn = true;
            req.session.email = user.email;
            req.session.firstName = user.firstName;
            return res.redirect('/user/home');
        } else {
            return res.render('pages/login', { error: 'Incorrect password' });
        }
    } catch (err) {
        console.error('Error during user login:', err);
        res.redirect('/');
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Error logging out');
        }
        res.redirect('/');
    });
});

// Signup Page
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        return res.redirect('/user/home');
    }
    res.render('pages/signup');
});

// Handle Signup
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return res.render('pages/signup', { error: 'User already registered' });
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
        delete data.repeatPassword;
        await User.create(data);
        res.redirect('/');
    } catch (err) {
        console.error('Error during user signup:', err);
        res.redirect('/signup');
    }
});

module.exports = router;
