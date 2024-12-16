const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminHomeController');

//Admin /
router.get('/', adminController.loginPage);

// Admin Login Page
router.get('/login', adminController.loginPage);

// Admin Login Logic
router.post('/login', adminController.postAdminLogin);

// Admin Home Page
router.get('/home', adminController.getAdminHome);

// Admin Logout
router.post('/logout', adminController.postLogout);

//Admin Signup 
router.get('/signup', adminController.getSignup);
router.post('/signup', adminController.postSignup);

//Admin User Add
router.get('/adduser', adminController.getAddUser);
router.post('/adduser', adminController.postAddUser);

//Admin User View
router.get('/viewuser/:id', adminController.getUserView);

//Admin User Edit
router.get('/edit-user/:id', adminController.getEditUser);
router.put('/edit-user/:id', adminController.putEditUser);

//Admin User 
router.delete('/delete-user/:id', adminController.deleteUser);

//Admin User Search
router.post('/search-user', adminController.getSearchUser);

module.exports = router;
