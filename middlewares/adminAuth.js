module.exports = (req, res, next) => {
    if (req.session && req.session.adminLoggedIn) {
        next();
    } else {
        req.session.flash = { error: 'Please login to access' };
        res.redirect('/admin/login');
    }
}