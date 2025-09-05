// Require
const db = require('../db');

// Require
const order = require('../libs/OrderMethods');

// Require
const service = require('../libs/ServicesMethods');

// Require
const employee = require('../libs/EmployeeMethods');

// Require
const handleErrors = require('../libs/ErrorsHandler');

// Require
const utils = require('../libs/Utils');

exports.dashboard = async (req, res) => {
    const data = {
        'siteTitle': 'Ideal Star Gents Salon',
        'pageTitle': 'Services'
    }
    res.render('index', data);
};

exports.services = async (req, res) => {
    try {

        const services = await service.fetchActiveServices();

        const response = {
            status: 'success',
            status_code: 200,
            services: services
        }
        res.json(response);

    } catch (error) {
        const response = handleErrors(error, '');
        res.status(response.status_code).json(response);
    }
};

exports.employees = async (req, res) => {
    try {

        const employees = await employee.fetchActiveEmployees();

        const response = {
            status: 'success',
            status_code: 200,
            employees: employees
        }
        res.json(response);

    } catch (error) {
        const response = handleErrors(error, '');
        res.status(response.status_code).json(response);
    }
};

exports.orderSales = (req, res) => {
    const siteData = {
        'siteTitle': 'Dashboard - Order Sales',
        'pageTitle': 'Order Sales'
    }
    res.render('order_sales', siteData);
};

exports.orderDetails = async (req, res) => {

    let orderId = req.params.id;

    let order_header = null;

    let order_details = null;

    if (orderId) {
        order_header = await order.findOrderHeaderWithEmployee(orderId);
        
        order_header.order_closed_at = utils.formateDateTimeString(order_header.order_closed_at);

        if(utils.checkForValue(order_header.amount_collected_by_owner_at)){
            order_header.amount_collected_by_owner_at = utils.formateDateTimeString(order_header.amount_collected_by_owner_at);
        }

        order_header.amount_collected_by_owner_at = utils.checkForValue(order_header.amount_collected_by_owner_at) ? order_header.amount_collected_by_owner_at : "NOT AVAILABLE";

        if (order_header) {
            order_details = await order.getOrderDetails(order_header.id);
        }
    }

    const siteData = {
        'siteTitle': 'Dashboard - Order Details',
        'pageTitle': 'Order Details',
        order_header, order_details
    }

    res.render('order_details', siteData);
};

exports.serviceSales = (req, res) => {
    const siteData = {
        'siteTitle': 'Dashboard - Service Sales',
        'pageTitle': 'Service Sales'
    }
    res.render('service_sales', siteData);
};

exports.employeeSales = (req, res) => {
    const siteData = {
        'siteTitle': 'Dashboard - Employee Sales',
        'pageTitle': 'Employee Sales'
    }
    res.render('employee_sales', siteData);
};

/**
 * Get employee sales
 * e.g card, cash sales
 * @param {*} req 
 * @param {*} res 
 * Returns JSON
 */
exports.fetchEmployeesSales = async (req, res) => {

    try {

        let { fromDate, toDate } = req.body;

        // If not provided, default to current date
        if (!fromDate || !toDate) {
            const now = new Date();
            fromDate = now.getFullYear() + "-0" + (now.getMonth() + 1) + "-0" + now.getDate() + " 00:00:00";
            toDate = now.getFullYear() + "-0" + (now.getMonth() + 1) + "-0" + now.getDate() + " 23:59:59";

        }

        const employeeSales = await employee.employeeSales(fromDate, toDate);

        const response = {
            status: 'success',
            status_code: 200,
            employeeSales: employeeSales
        }

        res.json(response);

    } catch (error) {
        const response = handleErrors(error, '');
        res.status(response.status_code).json(response);
    }
};

/**
 * Get service sales
 * e.g card, cash sales
 * @param {*} req 
 * @param {*} res 
 * Returns JSON
 */
exports.fetchServiceSales = async (req, res) => {

    try {

        let { fromDate, toDate } = req.body;

        // If not provided, default to current date
        if (!fromDate || !toDate) {
            const now = new Date();
            fromDate = now.getFullYear() + "-0" + (now.getMonth() + 1) + "-0" + now.getDate() + " 00:00:00";
            toDate = now.getFullYear() + "-0" + (now.getMonth() + 1) + "-0" + now.getDate() + " 23:59:59";

        }

        const serviceSales = await service.serviceSales(fromDate, toDate);

        const response = {
            status: 'success',
            status_code: 200,
            serviceSales: serviceSales
        }

        res.json(response);

    } catch (error) {
        const response = handleErrors(error, '');
        res.status(response.status_code).json(response);
    }
};

/**
 * Add to order
 * @param {*} req 
 * @param {*} res 
 * Returns JSON
 */
exports.activeOrder = async (req, res) => {
    try {

        const activeOrder = await order.getActiveOrder();

        const response = {
            status: 'success',
            status_code: 200,
            activeOrder: activeOrder
        }
        res.json(response);

    } catch (error) {
        const response = handleErrors(error, '');
        res.status(response.status_code).json(response);
    }
};

/**
 * Add to order
 * @param {*} req 
 * @param {*} res 
 * Returns JSON
 */
exports.addToOrder = async (req, res) => {

    try {

        const { service_id } = req.body;

        const order_id = await order.createOrder(service_id);

        const response = {
            status: 'success',
            code: 'ROW_ADDED',
            message: 'Added to order.',
            status_code: 201,
            order_id: order_id
        }
        res.json(response);

    } catch (error) {
        const response = handleErrors(error, '');
        res.status(response.status_code).json(response);
    }
};

/**
 * Remove from order
 * @param {*} req 
 * @param {*} res 
 * Returns JSON
 */
exports.removeFromOrder = async (req, res) => {

    try {

        const { order_header_id, service_id } = req.body;

        await order.removeFromOrder(order_header_id, service_id);

        const response = {
            status: 'success',
            code: 'ROW_REMOVED',
            message: 'Removed from order.',
            status_code: 201,
            order_id: order_header_id,
            service_id: service_id
        }
        res.json(response);

    } catch (error) {
        const response = handleErrors(error, '');
        res.status(response.status_code).json(response);
    }
};

/**
 * Remove from order
 * @param {*} req 
 * @param {*} res 
 * Returns JSON
 */
exports.closeOrder = async (req, res) => {

    try {

        const { amount_collected, employee_id, order_header_id, order_remarks, payable_amount, payment_type } = req.body;

        await order.closeOrder(amount_collected, employee_id, order_header_id, order_remarks, payable_amount, payment_type);

        const response = {
            status: 'success',
            code: 'ROW_UPDATED',
            message: 'Order closed successfully.',
            status_code: 201
        }
        res.json(response);

    } catch (error) {
        const response = handleErrors(error, '');
        res.status(response.status_code).json(response);
    }
};

/**
 * Get orders payments
 * e.g card, cash payments
 * @param {*} req 
 * @param {*} res 
 * Returns JSON
 */
exports.ordersPayments = async (req, res) => {

    try {

        let { fromDate, toDate } = req.body;

        // If not provided, default to current date
        if (!fromDate || !toDate) {
            const now = new Date();
            fromDate = now.getFullYear() + "-0" + (now.getMonth() + 1) + "-0" + now.getDate() + " 00:00:00";
            toDate = now.getFullYear() + "-0" + (now.getMonth() + 1) + "-0" + now.getDate() + " 23:59:59";
        }

        const ordersPayments = await order.ordersPayments(fromDate, toDate);

        const response = {
            status: 'success',
            status_code: 200,
            ordersPayments: ordersPayments
        }

        res.json(response);

    } catch (error) {
        const response = handleErrors(error, '');
        res.status(response.status_code).json(response);
    }
};

/**
 * Get closed orders
 * e.g closed orders with employee and payment details
 * @param {*} req 
 * @param {*} res 
 * Returns JSON
 */
exports.closedOrders = async (req, res) => {

    try {

        let { fromDate, toDate } = req.body;

        // If not provided, default to current date
        if (!fromDate || !toDate) {
            const now = new Date();
            fromDate = now.getFullYear() + "-0" + (now.getMonth() + 1) + "-0" + now.getDate() + " 00:00:00";
            toDate = now.getFullYear() + "-0" + (now.getMonth() + 1) + "-0" + now.getDate() + " 23:59:59";

        }

        const closedOrders = await order.closedOrders(fromDate, toDate);

        const response = {
            status: 'success',
            status_code: 200,
            closedOrders: closedOrders
        }

        res.json(response);

    } catch (error) {
        const response = handleErrors(error, '');
        res.status(response.status_code).json(response);
    }
};


