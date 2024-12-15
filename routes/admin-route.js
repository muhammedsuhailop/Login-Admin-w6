const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const adminController = require('../controllers/adminHomeController');

// Admin Login Page
router.get('/login', adminController.loginPage);

// Admin Login Logic
router.post('/login', adminController.postAdminLogin);

// Admin Home Page
router.get('/home', adminController.getAdminHome);

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
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ email, password: hashedPassword, name });
        await newAdmin.save();
        res.status(201);
        res.redirect('/admin/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering admin');
    }
});

//Admin User Add
router.get('/adduser', adminController.getAddUser);
router.post('/adduser', adminController.postAddUser);

//Admin User View
router.get('/viewuser/:id', adminController.getUserView);

//Admin User Edit
router.get('/edit-user/:id', adminController.getEditUser);
router.put('/edit-user/:id', adminController.putEditUser);

//Admin User Delete
router.delete('/delete-user/:id',adminController.deleteUser);


module.exports = router;
