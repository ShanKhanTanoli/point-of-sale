// Require
const utils = require('../libs/Utils');

// Require
const handleErrors = require('../libs/ErrorsHandler');

// Require
const auth = require('../libs/Auth');

// Require
const rolePermissions = require('../libs/RolePermissionsMethods');



/***************************************/
/*************BEGIN Roles & Permissions************/
/***************************************/

/**
 * View roles
 * @param {*} req 
 * @param {*} res
 * @returns Response
 */
exports.roles = async (req, res) => {

    try {

        // Check if auth user
        const user = await auth.user(req);

        if (utils.checkForValue(user)) {

            const roles = await rolePermissions.adminFetchRoles();

            const response = {
                status: 'success',
                status_code: 200,
                roles: roles
            }

            res.json(response);

        } else {
            throw new Error("Please login to continue.");
        }

    } catch (error) {
        const response = handleErrors(error, '');
        res.status(response.status_code).json(response);
    }

};

/**
 * Add role
 * @param {*} req 
 * @param {*} res
 * @returns Response
 */
exports.addRole = async (req, res) => {

    try {

        // Check if auth user
        const user = await auth.user(req);

        if (utils.checkForValue(user)) {
            // Check permission
            if (await auth.isUserSuperAdmin()) {

                const { roleNameInput, roleDescriptionInput, selectUserVisibility } = req.body;

                await rolePermissions.adminAddRole(roleNameInput, roleDescriptionInput, selectUserVisibility, user.id);

                const response = {
                    status: 'success',
                    status_code: 200,
                    message: "Added successfully."
                }
                res.json(response);

            } else throw new Error("Sorry you don't have permission.");

        } else {
            throw new Error("Please login to continue.");
        }

    } catch (error) {
        const response = handleErrors(error, '');
        res.status(response.status_code).json(response);
    }

};

/**
 * Update role
 * @param {*} req 
 * @param {*} res
 * @returns Response
 */
exports.updateRole = async (req, res) => {

    try {

        // Check if auth user
        const user = await auth.user(req);

        if (utils.checkForValue(user)) {
            // Check permission
            if (await auth.isUserSuperAdmin()) {

                const { roleIdInput, roleNameInput, roleDescriptionInput, selectUserVisibility } = req.body;

                await rolePermissions.adminUpdateRole(roleIdInput, roleNameInput, roleDescriptionInput, selectUserVisibility, user.id);

                const response = {
                    status: 'success',
                    status_code: 200,
                    message: "Updated successfully."
                }
                res.json(response);

            } else throw new Error("Sorry you don't have permission.");

        } else {
            throw new Error("Please login to continue.");
        }

    } catch (error) {
        const response = handleErrors(error, '');
        res.status(response.status_code).json(response);
    }

};

/**
 * Delete role
 * @param {*} req 
 * @param {*} res
 * @returns Response
 */
exports.deleteRole = async (req, res) => {
    console.log("Delete method...");
};

/***************************************/
/*************END Roles**************/
/***************************************/
