const User = require('../models/users');
const Admin = require('../models/admin');
const bcrypt = require('bcrypt');

//admin login GET
exports.loginPage = async (req, res) => {
    if (req.session.adminLoggedIn) {
        return res.redirect('/admin/home');
    }
    const flashMessage = req.session.flash || {};
    delete req.session.flash;
    res.render('pages/adminLogin', { flash: flashMessage });
};

//admin Login POST
exports.postAdminLogin = async (req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email });
        console.log(admin);
        if (!admin) {
            req.session.flash = { error: 'Admin not found' };
            return res.redirect('/admin/login');
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, admin.password);
        if (isPasswordMatch) {
            req.session.adminLoggedIn = true;
            req.session.adminEmail = admin.email;
            return res.redirect('/admin/home');
        } else {
            req.session.flash = { error: 'Incorrect password' }
            return res.redirect('/admin/login');
        }
    } catch (err) {
        console.error('Admin login error:', err);
        req.session.flash = { error: "An error occurred during login" }
        return res.redirect('/admin/login');
    }
};

// Admin Logout POST
exports.postLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Error logging out');
        }
        res.redirect('/admin/login');
    });
};

//admin Signup GET
exports.getSignup = (req, res) => {
    if (!req.session.adminLoggedIn) {
        return res.render('pages/adminSignup');
    }
    res.redirect('/admin/home');
};

//admin Signup POST
exports.postSignup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ email, password: hashedPassword, name });
        await newAdmin.save();
        res.status(201);
        req.session.flash = { success: 'New admin added successfully' };
        res.redirect('/admin/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering admin');
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
    if (!req.session.adminLoggedIn) {
        return res.redirect('/admin/login');
    }
    try {
        const user = await User.findOne({ _id: req.params.id });
        res.renderWithAdminLayout('pages/adminUserView', { user });
    } catch (err) {
        console.error(err);
    }
}

//admin User Edit GET
exports.getEditUser = async (req, res) => {
    if (!req.session.adminLoggedIn) {
        return res.redirect('/admin/login');
    }
    try {
        const user = await User.findOne({ _id: req.params.id });
        res.renderWithAdminLayout('pages/adminUserEdit', { user });
    } catch (err) {
        console.error(err);
    }
}

//admin User Edit PUT
exports.putEditUser = async (req, res) => {
    if (!req.session.adminLoggedIn) {
        return res.redirect('/admin/login');
    }
    try {
        const userId = req.params.id;
        const newData = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, newData, { new: true });
        req.session.flash = { success: 'Updated user data successfully' };
        res.redirect('/admin/home');
    } catch (err) {
        if (err.code === 11000) {
            const user = await User.findOne({ _id: req.params.id });
            const error = 'Given email already exist!';
            res.status(409);
            res.renderWithAdminLayout('pages/adminUserEdit', { user, error });
        } else {
            console.error(err.message);
            res.status(500).send('Error updating user data');
        }

    }
}

//admin User Delete DELETE
exports.deleteUser = async (req, res) => {
    if (!req.session.adminLoggedIn) {
        return res.redirect('/admin/login');
    }
    try {
        const userID = req.params.id;
        await User.findByIdAndDelete(userID);
        req.session.flash = { success: 'User deleted successfully' };
        res.redirect('/admin/home');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting user');
    }
}

//Admin User Search POST
exports.getSearchUser = async (req, res) => {
    if (!req.session.adminLoggedIn) {
        return res.redirect('/admin/login');
    }
    try {
        const query = req.body.searchTerm.trim();
        console.log(query);
        let usersData = [];
        const regex = new RegExp(query, 'i');
        usersData = await User.find({
            $or: [
                { firstName: regex },
                { lastName: regex },
                { email: regex }
            ]
        });
        const flashMessage = req.session.flash || {};
        delete req.session.flash;
        if (usersData.length === 0) {
            const error = "No users found!";
            return res.renderWithAdminLayout('pages/adminHome', { flash: flashMessage, error, usersData });
        }
        res.renderWithAdminLayout('pages/adminHome', { flash: flashMessage, usersData });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error searching user');
    }
}