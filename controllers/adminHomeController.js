//admin login GET
exports.loginPage = async (req,res)=>{
    if (req.session.adminLoggedIn) {
        return res.redirect('/admin/home');
    }
    res.render('pages/adminLogin', { error: null });
}