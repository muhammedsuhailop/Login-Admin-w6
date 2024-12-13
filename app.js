const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth-route');
const userRoutes = require('./routes/user-route');


const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: 'encrypitit',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, httpOnly: true },
    })
);

// Cache Control
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// Layout rendering helper
app.use((req, res, next) => {
    res.renderWithLayout = (page, options = {}) => {
        res.render(page, options, (err, html) => {
            if (err) return next(err);
            options.body = html;
            res.render('layout/main', options);
        });
    };
    next();
});

// Routes
app.use('/', authRoutes);
app.use('/user', userRoutes);

// Database Connection and Server Start
connectDB()
    .then(() => {
        console.log('Database connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(new Date().toISOString());
        });
    })
    .catch((err) => {
        console.error('Error in DB connection:', err);
    });




