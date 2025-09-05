// Require
const user = require('../libs/UserMethods');

// Require
const utils = require('../libs/Utils');

// Require
const handleErrors = require('../libs/ErrorsHandler');

// Require
const auth = require('../libs/Auth');

// Require
const userMethods = require('../libs/UserMethods');

// Require
const rolePermissions = require('../libs/RolePermissionsMethods');



/***************************************/
/*************BEGIN Users************/
/***************************************/

/**
 * View users
 * @param {*} req 
 * @param {*} res
 * @returns Response
 */
exports.users = async (req, res) => {

    try {

        // Init
        let users = null;
        let roles = null;

        // Check if auth user
        const user = await auth.user(req);

        if (utils.checkForValue(user)) {

            // Check permission
            if (await rolePermissions.canDoIt(req, 'read_users')) {
                users = await userMethods.adminFetchNonAdminUsers();
                roles = await rolePermissions.adminFetchRoles();
            }

            // Render regardless of permission outcome (empty users if no permission)
            const data = {
                siteTitle: 'Admin - Users',
                pageTitle: 'Users',
                users: users,
                roles: roles
            };

            res.render('admin/users', data);

        } else {
            res.redirect('/admin/login');
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong. Please try again later.');
    }

};

/**
 * Add user
 * @param {*} req 
 * @param {*} res
 * @returns Response
 */
exports.addUser = async (req, res) => {

    try {

        // Check if auth user
        const user = await auth.user(req);

        if (utils.checkForValue(user)) {
            // Check permission
            if (await rolePermissions.canDoIt(req, 'create_users')) {

                const { userNameInput, userEmailInput, userPasswordInput, userRoleIdInput, selectUserVisibility } = req.body;


                if (!utils.checkForValue(userNameInput)) {
                    throw new Error("Please enter user name.");
                }

                if (!utils.checkForValue(userEmailInput)) {
                    throw new Error("Please enter email.");
                }

                if (!utils.checkForValue(userPasswordInput)) {
                    throw new Error("Please enter password.");
                }

                if (!utils.checkForValue(userRoleIdInput)) {
                    throw new Error("Please select valid role.");
                }

                if (!utils.checkForValue(selectUserVisibility)) {
                    throw new Error("Please select visibility.");
                }

                await userMethods.adminAddNonAdminUser(userNameInput, userEmailInput, userPasswordInput, userRoleIdInput, selectUserVisibility, user.id);

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
 * Update user
 * @param {*} req 
 * @param {*} res
 * @returns Response
 */
exports.updateUser = async (req, res) => {

    try {

        // Check if auth user
        const user = await auth.user(req);

        if (utils.checkForValue(user)) {
            // Check permission
            if (await rolePermissions.canDoIt(req, 'update_users')) {

                const { userIdInput, userNameInput, userEmailInput, userRoleIdInput, selectUserVisibility } = req.body;

                if (!utils.checkForValue(userIdInput)) {
                    throw new Error("Please select a valid user.");
                }

                if (!utils.checkForValue(userNameInput)) {
                    throw new Error("Please enter user name.");
                }

                if (!utils.checkForValue(userEmailInput)) {
                    throw new Error("Please enter email.");
                }

                if (!utils.checkForValue(userRoleIdInput)) {
                    throw new Error("Please select valid role.");
                }

                if (!utils.checkForValue(selectUserVisibility)) {
                    throw new Error("Please select visibility.");
                }

                await userMethods.adminUpdateNonAdminUser(userIdInput, userNameInput, userEmailInput, userRoleIdInput, selectUserVisibility, user.id);

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
 * Update user password
 * @param {*} req 
 * @param {*} res
 * @returns Response
 */
exports.updateUserPassword = async (req, res) => {

    try {

        // Check if auth user
        const user = await auth.user(req);

        if (utils.checkForValue(user)) {
            // Check permission
            if (await rolePermissions.canDoIt(req, 'update_users')) {

                const { userIdInput, userPasswordInput } = req.body;

                if (!utils.checkForValue(userIdInput)) {
                    throw new Error("Please select a valid user.");
                }

                if (!utils.checkForValue(userPasswordInput)) {
                    throw new Error("Please enter password.");
                }

                await userMethods.adminUpdateNonAdminUserPassword(userIdInput, userPasswordInput, user.id);

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
 * Delete user
 * @param {*} req 
 * @param {*} res
 * @returns Response
 */
exports.deleteUser = async (req, res) => {
    console.log("Delete method...");
};

/***************************************/
/*************END Users**************/
/***************************************/
