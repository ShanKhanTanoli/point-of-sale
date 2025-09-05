// Require
const user = require('../libs/UserMethods');

// Require
const utils = require('../libs/Utils');

// Require
const handleErrors = require('../libs/ErrorsHandler');

// Require
const cookieMethods = require('../libs/CookieMethods');

// Require
const auth = require('../libs/Auth');

/**
 * Login page
 * @param {*} req 
 * @param {*} res 
 */
exports.loginPage = async (req, res) => {
    const data = {
        'siteTitle': 'Admin - Login',
        'pageTitle': 'Login'
    }
    let authUser = await auth.user(req);
    
    authUser != null ? res.redirect('/admin/dashboard') : res.render('admin/login', data);
};

/**
 * Login
 * @param {*} req 
 * @param {*} res 
 */
exports.submitLogin = async (req, res) => {

    try {

    const {user_email, user_password} = req.body;

    const userLogin = await user.makeLogin(user_email, user_password);

    const options = {

            // expires: expiryDate, // 👈 taken directly from DB
            // httpOnly: true,
            // secure: false,       // true if using HTTPS
            // sameSite: 'strict'


            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            httpOnly: true,              // not accessible from JS (for security)
            secure: false,               // set to true in production with HTTPS
            sameSite: 'strict',          // or 'lax'
    };

    // Set cookie
    cookieMethods.setCookie('token',userLogin.token, res, options);

    const response = {
        status: 'success',
        status_code: 200,
        message: 'Logged in successfully.',
        user: {
            token: userLogin.token,
            token_expiry: userLogin.token_expiry
        }
    }

    res.json(response);

    } catch (error) {
        const response = handleErrors(error, '');
        res.status(response.status_code).json(response);
    }
    
};

exports.dashboard = async (req, res) => {
    const data = {
        'siteTitle': 'Admin - Dashboard',
        'pageTitle': 'Dashboard'
    }

    let authUser = await auth.user(req);
    
    authUser != null ? res.render('admin/index', data) : res.redirect('/admin/login');

    
};

exports.usersList = (req, res) => {
    res.send('Admin Users List');
};
