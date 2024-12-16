const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminHomeController');
const adminAuth = require('../middlewares/adminAuth');

//Admin /
router.get('/', adminController.loginPage);

// Admin Login Page
router.get('/login', adminController.loginPage);

// Admin Login Logic
router.post('/login', adminController.postAdminLogin);

// Admin Home Page
router.get('/home', adminAuth, adminController.getAdminHome);

// Admin Logout
router.post('/logout', adminController.postLogout);

//Admin Signup 
router.get('/signup', adminController.getSignup);
router.post('/signup', adminController.postSignup);

//Admin User Add
router.get('/adduser', adminAuth, adminController.getAddUser);
router.post('/adduser', adminAuth, adminController.postAddUser);

//Admin User View
router.get('/viewuser/:id', adminAuth, adminController.getUserView);

//Admin User Edit
router.get('/edit-user/:id', adminAuth, adminController.getEditUser);
router.put('/edit-user/:id', adminAuth, adminController.putEditUser);

//Admin User Delete
router.delete('/delete-user/:id', adminAuth, adminController.deleteUser);

//Admin User Search
router.post('/search-user', adminAuth, adminController.getSearchUser);

module.exports = router;
