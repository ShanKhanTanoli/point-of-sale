/**
 * Session
 * It will be used for the backend
 * It contains all the methods related to the session
 */

const user = require('./UserMethods');

const utilMethods = require('./Utils');

const cookieMethods = require('./CookieMethods');

/**
 * Check whether session is expired
 * @param {*} token
 * @return Boolean
 */
exports.sessionIsExpired = async (token) => {
    return false;
}

/**
 * Get auth user
 * @param {*} request
 * @return Object
 */
exports.user = async (request) => {
    // Init
    let getUser = null;
    // Get token
    const getToken = await cookieMethods.getToken(request);
    // Check for the value
    if(utilMethods.checkForValue(getToken)){
        // Get user
        getUser = await user.findUserByToken(getToken);
    }
    return getUser;
}

/**
 * Check user is super admin
 * @param {*} request
 * @return Boolean
 */
exports.isUserSuperAdmin = async (request) => {
    // Init
    let userIsSuperAdmin = false;
    // Check if user is logged in
    if(utilMethods.checkForValue(await this.user(request))){
        //Get user
        const getUser = await this.user(request);
        userIsSuperAdmin = getUser.user_role === "super-admin" ? true : false; 
    }
    return userIsSuperAdmin;
}