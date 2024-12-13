const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Admin = require('../models/admin'); 
const adminController = require('../controllers/adminHomeController');

// Admin Login Page
// router.get('/login', (req, res) => {
//     if (req.session.adminLoggedIn) {
//         return res.redirect('/admin/home');
//     }
//     res.render('pages/adminLogin', { error: null });
// });
router.get('/login',adminController.loginPage);

// Admin Login Logic
router.post('/login', async (req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email});
        console.log(admin);
        if (!admin) {
            return res.render('pages/adminLogin', { error: 'Admin not found' });
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, admin.password);
        if (isPasswordMatch) {
            req.session.adminLoggedIn = true;
            req.session.adminEmail = admin.email;
            return res.redirect('/admin/home');
        } else {
            res.render('pages/adminLogin', { error: 'Incorrect password' });
        }
    } catch (err) {
        console.error('Admin login error:', err);
        res.render('pages/adminLogin', { error: 'An error occurred during login' });
    }
});

// Admin Home Page
router.get('/home', (req, res) => {
    if (!req.session.adminLoggedIn) {
        return res.redirect('/admin/login');
    }
    // res.render('pages/adminHome', { title: 'Admin Home', adminEmail: req.session.adminEmail });
    res.renderWithAdminLayout('pages/adminHome');
});

// Admin Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Error logging out');
        }
        res.redirect('/admin/login');
    });
});

router.get('/signup', (req, res) => {
    if (!req.session.adminLoggedIn) {
        return res.render('pages/adminSignup');
    }
    res.render('pages/adminHome', { title: 'Admin Home', adminEmail: req.session.adminEmail });
});

router.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const newAdmin = new Admin({ email, password: hashedPassword, name });
        await newAdmin.save();
        res.status(201);
        res.redirect('/admin/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering admin');
    }
});



module.exports = router;
