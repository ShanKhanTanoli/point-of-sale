// Require
const utils = require('../libs/Utils');

// Require
const handleErrors = require('../libs/ErrorsHandler');

// Require
const auth = require('../libs/Auth');

// Require
const servicesMethods = require('../libs/ServicesMethods');

// Require
const rolePermissions = require('../libs/RolePermissionsMethods');



/***************************************/
/*************BEGIN Services************/
/***************************************/

/**
 * View services
 * @param {*} req 
 * @param {*} res
 * @returns Response
 */
exports.services = async (req, res) => {

    try {
        // Init
        let services = null;

        // Check if auth user
        const user = await auth.user(req);

        if (utils.checkForValue(user)) {
            // Check permission
            if (await rolePermissions.canDoIt(req, 'read_services')) {
                services = await servicesMethods.adminFetchServices();
            }

            // Render regardless of permission outcome (empty services if no permission)
            const data = {
                siteTitle: 'Admin - Services',
                pageTitle: 'Services',
                services: services
            };
            res.render('admin/services', data);
        } else {
            res.redirect('/admin/login');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong. Please try again later.');
    }

};

/**
 * Add service
 * @param {*} req 
 * @param {*} res
 * @returns Response
 */
exports.addService = async (req, res) => {

    try {

        // Check if auth user
        const user = await auth.user(req);

        if (utils.checkForValue(user)) {
            // Check permission
            if (await rolePermissions.canDoIt(req, 'create_services')) {

                const { serviceNameInput, servicePriceInput, selectServiceVisibility } = req.body;

                if (!utils.checkForValue(serviceNameInput)) {
                    throw new Error("Please enter service name.");
                }

                if (!utils.checkForValue(servicePriceInput)) {
                    throw new Error("Please enter service price.");
                }

                if (!utils.checkForValue(selectServiceVisibility)) {
                    throw new Error("Please select visibility.");
                }

                await servicesMethods.adminAddService(serviceNameInput, servicePriceInput, selectServiceVisibility, user.id);

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
 * Update service
 * @param {*} req 
 * @param {*} res
 * @returns Response
 */
exports.updateService = async (req, res) => {

    try {

        // Check if auth user
        const user = await auth.user(req);

        if (utils.checkForValue(user)) {
            // Check permission
            if (await rolePermissions.canDoIt(req, 'update_services')) {

                const { serviceIdInput, serviceNameInput, servicePriceInput, selectServiceVisibility } = req.body;

                if (!utils.checkForValue(serviceIdInput)) {
                    throw new Error("Please select valid service.");
                }

                if (!utils.checkForValue(serviceNameInput)) {
                    throw new Error("Please enter service name.");
                }

                if (!utils.checkForValue(servicePriceInput)) {
                    throw new Error("Please enter service price.");
                }

                if (!utils.checkForValue(selectServiceVisibility)) {
                    throw new Error("Please select visibility.");
                }

                await servicesMethods.adminUpdateService(serviceIdInput, serviceNameInput, servicePriceInput, selectServiceVisibility, user.id);

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
 * Delete service
 * @param {*} req 
 * @param {*} res
 * @returns Response
 */
exports.deleteService = async (req, res) => {
    console.log("Delete method...");
};

/***************************************/
/*************END Services**************/
/***************************************/
