// Require
const utils = require('../libs/Utils');

// Require
const handleErrors = require('../libs/ErrorsHandler');

// Require
const auth = require('../libs/Auth');

// Require
const orderMethods = require('../libs/OrderMethods');

// Require
const rolePermissions = require('../libs/RolePermissionsMethods');



/***************************************/
/*************BEGIN Orders************/
/***************************************/

/**
 * View services
 * @param {*} req 
 * @param {*} res
 * @returns Response
 */
exports.orders = async (req, res) => {

    try {

        // Init
        let orders = null;

        // Check if auth user
        const user = await auth.user(req);

        if (utils.checkForValue(user)) {
            // Check permission
            if (await rolePermissions.canDoIt(req, 'read_orders')) {
                orders = await orderMethods.closedOrders("", "");
            }

            // Render regardless of permission outcome (empty orders if no permission)
            const data = {
                siteTitle: 'Admin - Orders',
                pageTitle: 'Orders',
                orders: orders
            };
            res.render('admin/orders', data);
        } else {
            res.redirect('/admin/login');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong. Please try again later.');
    }

};

/**
 * Collect orders
 * @param {*} req 
 * @param {*} res
 * @returns Response
 */
exports.collectOrders = async (req, res) => {

    try {


        // Check if auth user
        const user = await auth.user(req);

        if (utils.checkForValue(user)) {

            // Check permission
            if (await rolePermissions.canDoIt(req, 'collect_orders')) {

                const { orderIds } = req.body;

                if (!utils.checkForValue(orderIds)) {
                    throw new Error("Please select order. Order ids are missing.");
                }

                if (!orderIds.length > 0) {
                    throw new Error("Please select order. Order ids are missing.");
                }

                orderIds.map(async (order, index) => {
                    await orderMethods.adminCollectOrder(user.id, order);
                });

                const response = {
                    status: 'success',
                    status_code: 200,
                    message: "Collected successfully."
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
 * Uncollect orders
 * @param {*} req 
 * @param {*} res
 * @returns Response
 */
exports.uncollectOrders = async (req, res) => {

    try {


        // Check if auth user
        const user = await auth.user(req);

        if (utils.checkForValue(user)) {

            // Check permission
            if (await rolePermissions.canDoIt(req, 'uncollect_orders')) {

                const { orderIds } = req.body;

                if (!utils.checkForValue(orderIds)) {
                    throw new Error("Please select order. Order ids are missing.");
                }

                if (!orderIds.length > 0) {
                    throw new Error("Please select order. Order ids are missing.");
                }

                orderIds.map(async (order, index) => {
                    await orderMethods.adminUncollectOrder(user.id, order);
                });

                const response = {
                    status: 'success',
                    status_code: 200,
                    message: "Order reversed successfully."
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
 * Collect bulk orders
 * @param {*} req 
 * @param {*} res
 * @returns Response
 */
exports.bulkCollectOrders = async (req, res) => {

    try {

        // Check if auth user
        const user = await auth.user(req);

        if (utils.checkForValue(user)) {

            // Check permission
            if (await rolePermissions.canDoIt(req, 'collect_orders')) {

                let { fromDate, toDate } = req.body;

                // If not provided, default to current date
                if (!fromDate || !toDate) {
                    const now = new Date();
                    fromDate = now.getFullYear() + "-0" + (now.getMonth() + 1) + "-0" + now.getDate() + " 00:00:00";
                    toDate = now.getFullYear() + "-0" + (now.getMonth() + 1) + "-0" + now.getDate() + " 23:59:59";

                }

                await orderMethods.adminCollectBulkOrders(user.id, fromDate, toDate);

                const response = {
                    status: 'success',
                    status_code: 200,
                    message: "Order collected successfully."
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
 * View order
 * @param {*} req 
 * @param {*} res
 * @returns Response
 */
exports.viewOrder = async (req, res) => {


    let authUser = await auth.user(req);

    let order_header = null;

    let order_details = null;

    let orderId = req.params.id;

    if (utils.checkForValue(authUser)) {

        // Check permission
        if (await rolePermissions.canDoIt(req, 'read_orders')) {

            if (orderId) {
                order_header = await orderMethods.findOrderHeaderWithEmployeeForAdmin(orderId);
                
                order_header.order_closed_at = utils.formateDateTimeString(order_header.order_closed_at);

                if(utils.checkForValue(order_header.amount_collected_by_owner_at)){
                    order_header.amount_collected_by_owner_at = utils.formateDateTimeString(order_header.amount_collected_by_owner_at);
                }

                order_header.amount_collected_by_owner_at = utils.checkForValue(order_header.amount_collected_by_owner_at) ? order_header.amount_collected_by_owner_at : "NOT AVAILABLE";

                if (order_header) {
                    order_details = await orderMethods.getOrderDetails(order_header.id);
                }
            }

        }

        const data = {
            'siteTitle': 'Admin - View Order',
            'pageTitle': 'View Order',
            order_header, order_details
        }

        res.render('admin/order_details', data);

    } else {

        const data = {
            'siteTitle': 'Admin - Login',
            'pageTitle': 'Login'
        }

        res.render('admin/login', data);
    }

};

/**
 * Re open order
 * @param {*} req 
 * @param {*} res
 * @returns Response
 */
exports.reopen = async (req, res) => {

    try {

        // Check if auth user
        const user = await auth.user(req);

        if (utils.checkForValue(user)) {

            // Check permission
            if (await rolePermissions.canDoIt(req, 'update_orders')) {

                const { order_header_id } = req.body;

                if (!utils.checkForValue(order_header_id)) {
                    throw new Error("Please select order. Order id is missing.");
                }
                
                await orderMethods.adminReOpenOrder(user.id, order_header_id);

                const response = {
                    status: 'success',
                    status_code: 200,
                    message: "Order re-opened successfully."
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

/***************************************/
/*************END Orders**************/
/***************************************/
