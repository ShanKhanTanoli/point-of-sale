const express = require('express');
const router = express.Router();

const appController = require('../controllers/AppController');

// Public unprotected routes
router.get('/', appController.dashboard);
router.get('/services', appController.services);
router.get('/employees', appController.employees);
router.get('/OrderSales', appController.orderSales);
router.get('/Order/Details/:id', appController.orderDetails);
router.get('/ServiceSales', appController.serviceSales);
router.get('/EmployeeSales', appController.employeeSales);

// Order routes
router.get('/activeOrder', appController.activeOrder);
router.post('/addToOrder', appController.addToOrder);
router.post('/removeFromOrder', appController.removeFromOrder);
router.post('/closeOrder', appController.closeOrder);
router.post('/ordersPayments', appController.ordersPayments);
router.post('/closedOrders', appController.closedOrders);

// Sales routes
router.post('/fetchEmployeesSales', appController.fetchEmployeesSales);
router.post('/fetchServiceSales', appController.fetchServiceSales);

module.exports = router;