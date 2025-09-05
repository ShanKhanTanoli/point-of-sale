/**
 * Cookies
 * It will be used for the backend
 * It contains all the methods related to the cookies
 */

/**
 * Set cookie
 * @param {*} key 
 * @param {*} value
 * @param {*} response  
 * @param {*} options 
 * @return Void
 */
exports.setCookie = async (key, value, response, options) => {
    response.cookie(key, value, options);
}

/**
 * Get cookie
 * @param {*} request
 * @param {*} key 
 * @return String
 */
exports.getCookieValueByKey = async (request, key) => {
    return request.cookies[key];
}

/**
 * Get cookie
 * @param {*} request
 * @return String
 */
exports.getToken = async (request) => {
    return request.cookies.token;
}