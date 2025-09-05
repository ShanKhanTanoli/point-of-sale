// Require
require('dotenv').config();

// Require
const express = require('express');

// Require
const cookieParser = require('cookie-parser');

// Make instance
const app = express();

// Require
const path = require('path');

// Require
const userRoutes = require('./routes/UserRoutes');

// Require
const adminRoutes = require('./routes/AdminRoutes');

// Require
const appRoutes = require('./routes/Routes');

// Middleware to parse JSON body
app.use(express.json()); // Required for JSON body

app.use(express.urlencoded({ extended: true })); // For form data

// Server port
const port = process.env.SERVER_PORT || 3000;

// Set view
app.set('view engine','ejs');

app.set('views', path.join(__dirname, 'views'))

// Set path
app.use(express.static(path.join(__dirname, 'public')));

// Set cookie
app.use(cookieParser());

// Include routes
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/', appRoutes);

// Error page
app.use((req, res, next) => {
            const data = {
            'siteTitle': '404 - Page not found',
            'pageTitle': '404',
            'message': 'The page you are looking for does not exist.'
        };
  res.status(404).render('error404', data);
});

// Error page
app.use((err, req, res, next) => {
        const data = {
            'siteTitle': '500 - Something went wrong on our end.',
            'pageTitle': '500',
            'message': 'Something went wrong on our end.'
        };
  res.status(500).render('error500', data);
});

// Listen
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});