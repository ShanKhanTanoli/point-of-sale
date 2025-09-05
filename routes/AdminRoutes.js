const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const adminOrdersController = require('../controllers/AdminOrdersController');
const adminUsersController = require('../controllers/AdminUsersController');
const adminServicesController = require('../controllers/AdminServicesController');
const adminRolePermissionsController = require('../controllers/AdminRolePermissionsController');

// Dashboard routes
router.get('/', adminController.dashboard);
router.get('/dashboard', adminController.dashboard);

// Order routes
router.get('/orders', adminOrdersController.orders);
router.post('/orders/collect', adminOrdersController. collectOrders);
router.post('/orders/uncollect', adminOrdersController. uncollectOrders);
router.post('/orders/bulkCollect', adminOrdersController. bulkCollectOrders);
router.get('/order/view/:id', adminOrdersController. viewOrder);
router.post('/order/reopen', adminOrdersController. reopen);

// router.post('/addOrder', adminOrdersController.addOrder);
// router.post('/updateOrder', adminOrdersController.updateOrder);
// router.post('/deleteOrder', adminOrdersController.deleteOrder);

// Services routes
router.get('/services', adminServicesController.services);
router.post('/addService', adminServicesController.addService);
router.post('/updateService', adminServicesController.updateService);
router.post('/deleteService', adminServicesController.deleteService);

// Users routes
router.get('/users', adminUsersController.users);
router.post('/addUser', adminUsersController.addUser);
router.post('/updateUser', adminUsersController.updateUser);
router.post('/updateUserPassword', adminUsersController.updateUserPassword);
router.post('/deleteUser', adminUsersController.deleteUser);

// Roles routes
router.post('/roles', adminRolePermissionsController.roles);
router.post('/addRole', adminRolePermissionsController.addRole);
router.post('/updateRole', adminRolePermissionsController.updateRole);
router.post('/deleteRole', adminRolePermissionsController.deleteRole);


router.get('/login', adminController.loginPage);
router.post('/submitLogin', adminController.submitLogin);

router.get('/users', adminController.usersList);

module.exports = router;