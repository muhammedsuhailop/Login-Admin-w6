const express = require('express');
const router = express.Router();

// Middleware for authentication
const userAuth = (req, res, next) => {
    if (req.session.loggedIn) {
        return next();
    }
    res.redirect('/');
};

// Home Page
router.get('/home', userAuth, (req, res) => {
    res.renderWithLayout('pages/home.ejs', {
        title: 'Home Page',
        username: req.session.firstName,
    });
});



module.exports = router;
