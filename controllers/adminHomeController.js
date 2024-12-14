const User = require('../models/users');
const Admin = require('../models/admin');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//admin login GET
exports.loginPage = async (req, res) => {
    if (req.session.adminLoggedIn) {
        return res.redirect('/admin/home');
    }
    res.render('pages/adminLogin', { error: null });
}

//admin Login POST
exports.postAdminLogin = async (req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email });
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
};

//admin addUser GET
exports.getAddUser = async (req, res) => {
    if (req.session.adminLoggedIn) {
        return res.renderWithAdminLayout('pages/adminNewUser');
    }
    res.render('pages/adminLogin', { error: null });
}

//admin addUser POST
exports.postAddUser = async (req, res) => {
    if (req.session.adminLoggedIn) {
        try {
            const data = req.body;
            const existingUser = await User.findOne({ email: data.email });
            if (existingUser) {
                return res.renderWithAdminLayout('pages/adminNewUser', { error: 'User already registered' });
            }
            const hashedPassword = await bcrypt.hash(data.password, 10);
            data.password = hashedPassword;
            delete data.repeatPassword;
            await User.create(data);
            req.session.flash = { success: 'New used added successfully' };
            res.redirect('/admin/home');
        } catch (err) {
            console.log(err);
        }
    } else {
        res.render('pages/adminLogin', { error: null });
    }
}

//admin Home get
exports.getAdminHome = async (req, res) => {
    if (!req.session.adminLoggedIn) {
        return res.redirect('/admin/login');
    }
    const flashMessage = req.session.flash || {};
    delete req.session.flash;
    try {
        const usersData = await User.find({});
        res.renderWithAdminLayout('pages/adminHome', { flash: flashMessage, usersData });
    } catch (err) {
        console.error(err);
    }
};

//admin Use View GET
exports.getUserView = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        res.renderWithAdminLayout('pages/adminUserView', { user });
    } catch (err) {
        console.error(err);
    }
}

//admin User Edit GET
exports.getEditUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        res.renderWithAdminLayout('pages/adminUserEdit', { user });
    } catch (err) {
        console.error(err);
    }
}

//admin User Edit PUT
exports.putEditUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const newData = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, newData, { new: true });
        req.session.flash = { success: 'Updated user data successfully' };
        // res.renderWithAdminLayout('pages/home');
        res.redirect('/admin/home');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating user data');
    }
}