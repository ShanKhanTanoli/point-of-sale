/**
 * Users
 * It will be used for the backend
 * It contains all the methods related to the users
 */

// Require
const db = require('../db');

// Require
const crypto = require('crypto');

// Require
const uuid = require('uuid');

// Require
const utils = require('./Utils');

/**
 * Get user
 * Get single row
 * @param {*} user_email 
 * @returns SQL row object
 */
exports.findUserByEmail = async (user_email) => {
    const [rows] = await db.execute(
        `select * from users where user_email = ?`,
        [user_email]
    );
    return rows.length ? rows[0] : null;
};

/**
 * Get user
 * Get single row
 * @param {*} id 
 * @returns SQL row object
 */
exports.findUserById = async (id) => {
    const [rows] = await db.execute(
        `select * from users where id = ?`,
        [id]
    );
    return rows.length ? rows[0] : null;
};

/**
 * Get user
 * Get single row
 * @param {*} token 
 * @returns SQL row object
 */
exports.findUserByToken = async (token) => {
    const [rows] = await db.execute(
        `select * from users where token = ?`,
        [token]
    );
    return rows.length ? rows[0] : null;
};

/**
 * Get order with user_password
 * Get single row
 * @param {*} user_password 
 * @returns SQL row object
 */
exports.findUserByPassword = async (user_password) => {
    const [rows] = await db.execute(
        `select * from users where user_password = md5(?)`,
        [user_password]
    );
    return rows.length ? rows[0] : null;
};

/**
 * Make user login
 * Update token, token expiry
 * Get single row
 * @param {*} user_email 
 * @param {*} user_password 
 * @returns SQL row object
 */

exports.makeLogin = async (user_email, user_password) => {

    // Init
    let output = null;

    const currentDateTime = new Date();
    const updatedDate = new Date(currentDateTime.getTime() + 6 * 60 * 60 * 1000);

    // Fetch user by email
    const user = await this.findUserByEmail(user_email);

    // If user found
    if (user) {

        // Check password
        const hashedInputPassword = utils.createHash(user_password);

        if (hashedInputPassword === user.user_password) {

            if (user.is_active == 1) {
                // Generate new token
                const newToken = crypto.createHash('md5').update(uuid.v4()).digest('hex');

                // Update token and expiry
                await db.execute(
                    `UPDATE users SET token=?, token_expiry=? WHERE user_email=?`,
                    [newToken, updatedDate, user_email]
                );

                // Add token to return object (optional)
                user.token = newToken;

                output = user;
            } else {
                throw new Error('Your account is not active.');
            }

        } else {
            throw new Error('Please check your password.');
        }
    } else {
        throw new Error('Please check your email.');
    }

    // Return
    return output;
};


/**************************************************/
/********************BEGIN ADMIN*******************/
/**************************************************/
/**
 * Get rows
 * @returns Array of objects
 */
exports.adminFetchNonAdminUsers = async () => {
    // SQL
    const SQL = `SELECT u.id AS user_id, u.user_name, u.user_email, u.user_role, u.is_active, rol.role_name FROM users u LEFT JOIN roles rol ON u.role_id=rol.id WHERE user_role NOT IN('super-admin')`;
    // Execute
    const [users] = await db.execute(SQL);
    // Return
    return users.length ? users : [];
};

/**
 * Get row
 * @param {*} id
 * @returns Object
 */
exports.adminFetchNonAdminUserById = async (id) => {
    // SQL
    const SQL = `SELECT * FROM users WHERE id=? user_role NOT IN('super-admin')`;
    // Execute
    const [users] = await db.execute(SQL, [id]);
    // Return
    return users.length ? users : [];
};

/**
 * Update non admin user
 * @param {*} id
 * @param {*} user_name 
 * @param {*} user_email 
 * @param {*} role_id 
 * @param {*} is_active 
 * @param {*} updated_by 
 * @returns Void
 */
exports.adminUpdateNonAdminUser = async (id, user_name, user_email, role_id, is_active, updated_by) => {
    const SQL = `
        UPDATE users 
        SET user_name = ?, user_email = ?, role_id = ?, is_active = ?, updated_at = NOW(), updated_by = ?
        WHERE id = ? AND user_role NOT IN('super-admin')`;
    await db.execute(SQL, [user_name, user_email, role_id, is_active, updated_by, id]);
};


/**
 * Update non admin user password
 * @param {*} id
 * @param {*} user_password 
 * @param {*} updated_by 
 * @returns Void
 */
exports.adminUpdateNonAdminUserPassword = async (id, user_password, updated_by) => {
    // Hashed password
    const hashedInputPassword = utils.createHash(user_password);
    const SQL = `
        UPDATE users 
        SET user_password = ?, updated_at = NOW(), updated_by = ?
        WHERE id = ? AND user_role NOT IN('super-admin')`;
    await db.execute(SQL, [hashedInputPassword, updated_by, id]);
};


/**
 * Add non admin user
 * @param {*} user_name 
 * @param {*} user_email 
 * @param {*} user_password 
 * @param {*} role_id 
 * @param {*} is_active 
 * @param {*} created_by 
 * @returns Void
 */
exports.adminAddNonAdminUser = async (user_name, user_email, user_password, role_id, is_active, created_by) => {
    // Hashed password
    const hashedInputPassword = utils.createHash(user_password);
    // SQL
    const SQL = `INSERT INTO users(user_name, user_email, user_password, role_id, is_active, created_at, created_by) VALUES(?, ?, ?, ?, ?, NOW(), ?)`;
    // Execute
    await db.execute(SQL, [user_name, user_email, hashedInputPassword, role_id, is_active, created_by]);
};
/**************************************************/
/**********************END ADMIN*******************/
/**************************************************/

