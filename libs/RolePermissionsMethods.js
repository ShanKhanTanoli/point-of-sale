/**
 * Roles & Permissions
 * It will be used for the backend
 * It contains all the methods related to the roles & permissions
 */

// Require
const db = require('../db');

// Require
const auth = require('./Auth');

// Require
const utilMethods = require('./Utils');

/**
 * User can
 * @param {*} request
 * @param {*} key
 * @return Boolean
 */
exports.canDoIt = async (request, key) => {
    let userCan = false;

    // Get the user
    const user = await auth.user(request);

    if (utilMethods.checkForValue(user)) {
        // If super admin, allow
        if (await auth.isUserSuperAdmin(request)) {
            userCan = true;
        } else {
            if(utilMethods.checkForValue(user.role_id)){
                // Get permissions once
                const permissions = await this.getPermissionsByRoleId(user.role_id);
                if (utilMethods.checkForValue(permissions)) {
                    userCan = permissions[key] === 1;
                }
            }
        }
    }
    return userCan;
};



/**
 * Get permissions
 * @param {*} role_id
 * @return Boolean
 */
exports.getPermissionsByRoleId = async (role_id) => {
    const [rows] = await db.execute(
        `SELECT * FROM permissions WHERE role_id = ? order by id limit 1`, [role_id]
    );
    return rows.length ? rows[0] : null;
}

/**************************************************/
/********************BEGIN ADMIN*******************/
/**************************************************/
/**
 * Get rows
 * @returns Array of objects
 */
exports.adminFetchRoles = async () => {
    // SQL
    const SQL = `SELECT * FROM roles`;
    // Execute
    const [roles] = await db.execute(SQL);
    // Return
    return roles.length ? roles : [];
};

/**
 * Get row
 * @param {*} id
 * @returns Object
 */
exports.adminFetchRoleById = async (id) => {
    // SQL
    const SQL = `SELECT * FROM roles WHERE id=?`;
    // Execute
    const [roles] = await db.execute(SQL, [id]);
    // Return
    return roles.length ? roles : [];
};

/**
 * Update non admin user
 * @param {*} id
 * @param {*} role_name 
 * @param {*} role_description 
 * @param {*} is_active 
 * @param {*} updated_by 
 * @returns Void
 */
exports.adminUpdateRole = async (id, role_name, role_description, is_active, updated_by) => {
    const SQL = `
        UPDATE roles 
        SET role_name = ?, role_description = ?, is_active = ?, updated_at = NOW(), updated_by = ?
        WHERE id = ? AND user_role NOT IN('super-admin')`;
    await db.execute(SQL, [role_name, role_description, is_active, updated_by, id]);
};


/**
 * Add non admin user
 * @param {*} role_name 
 * @param {*} role_description 
 * @param {*} is_active 
 * @param {*} created_by 
 * @returns Void
 */
exports.adminAddRole = async (role_name, role_description, is_active, created_by) => {
    // SQL
    const SQL = `INSERT INTO roles(role_name, role_description, is_active, created_at, created_by) VALUES(?, ?, ?, NOW(), ?)`;
    // Execute
    await db.execute(SQL, [role_name, role_description, is_active, created_by]);
};
/**************************************************/
/**********************END ADMIN*******************/
/**************************************************/