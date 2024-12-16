const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const router = express.Router();

// Login Page
router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        return res.redirect('/user/home');
    }
    const flashMessage = req.session.flash || {};
    delete req.session.flash;
    res.render('pages/login', { flash: flashMessage });
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        return res.redirect('/user/home');
    }
    res.redirect('/');
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.redirect('/login?error=User not found');
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (isPasswordMatch) {
            req.session.loggedIn = true;
            req.session.email = user.email;
            req.session.firstName = user.firstName;
            return res.redirect('/user/home');
        } else {
            return res.redirect('/login?error=Incorrect password');
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
    const flashMessage = req.session.flash || {};
    delete req.session.flash;
    res.render('pages/signup', { flash: flashMessage });
});

// Handle Signup
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            req.session.flash = { error: 'Given email already registered!' }
            return res.redirect('/signup');
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
        delete data.repeatPassword;
        await User.create(data);
        req.session.flash = { success: 'Signup successful!' };
        res.redirect('/');
    } catch (err) {
        console.error('Error during user signup:', err);
        req.session.flash = { error: 'Internal error on signup' }
        res.redirect('/signup');
    }
});

module.exports = router;
