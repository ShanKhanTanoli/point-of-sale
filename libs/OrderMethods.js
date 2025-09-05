/**
 * Orders
 * It will be used for the backend
 * It contains all the methods related to the orders
 */

// Require
const db = require('../db');
const { checkForValue } = require('./Utils');

/**
 * Get order with open status
 * Get single row
 * @returns SQL row object
 */
exports.getOpenOrder = async () => {
  const [rows] = await db.execute(
    `SELECT id, employee_id, payment_type, payable_amount, amount_collected, order_status
       FROM order_header
       WHERE order_status = ?
       ORDER BY id DESC
       LIMIT 1`,
    ['open']
  );
  return rows.length ? rows[0] : null;
};

/**
 * Get order with id
 * Get single row
 * @param {*} order_header_id 
 * @returns SQL row object
 */
exports.findOrderHeader = async (order_header_id) => {
  const [rows] = await db.execute(
    `SELECT id,
    employee_id,
    payment_type,
    payable_amount,
    amount_collected,
    order_status,
    order_closed_at,
    order_remarks
       FROM order_header
       WHERE id = ?`,
    [order_header_id]
  );
  return rows.length ? rows[0] : null;
};

/**
 * Get order with id
 * Get single row
 * @param {*} order_header_id 
 * @returns SQL row object
 */
exports.findOrderHeaderWithAllColumns = async (order_header_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM order_header WHERE id = ?`,
    [order_header_id]
  );
  return rows.length ? rows[0] : null;
};

/**
 * Get order with id
 * Get single row
 * @param {*} order_header_id 
 * @returns SQL row object
 */
exports.findOriginalOrderHeaderFromHistoryWithAllColumns = async (order_header_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM order_header_history WHERE order_id = ? and order_amendment_status = "original"`,
    [order_header_id]
  );
  return rows.length ? rows[0] : null;
};

/**
 * Get order with id
 * Get single row
 * @param {*} order_header_id 
 * @returns SQL row object
 */
exports.findOrderHeaderFromHistoryWithAllColumns = async (order_header_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM order_header_history WHERE order_id = ?`,
    [order_header_id]
  );
  return rows.length ? rows[0] : null;
};


/**
 * Get order details with id
 * Get single row
 * @param {*} order_header_id 
 * @returns SQL row object
 */
exports.findOrderDetailsWithAllColumns = async (order_header_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM order_details WHERE order_header_id = ?`,
    [order_header_id]
  );
  return rows;
};


/**
 * Get order with id
 * Get single row
 * @param {*} order_header_id 
 * @returns SQL row object
 */
exports.findOrderHeaderWithEmployee = async (order_header_id) => {
  const [rows] = await db.execute(
    `SELECT 
          oh.id,
          oh.amount_collected_by_owner,
          oh.amount_collected_by_owner_at,
          employee_id,
          payment_type,
          payable_amount,
          amount_collected,
          balance_amount,
          order_status,
          order_closed_at,
          emp.employee_name,
          order_remarks
      FROM
          order_header oh
              LEFT JOIN
          employees emp ON emp.id = oh.employee_id
      WHERE
          oh.id = ? AND emp.is_active = 1`,
    [order_header_id]
  );
  return rows.length ? rows[0] : null;
};

/**
 * Service already added
 * Get single row
 * @param {*} service_id 
 * @returns SQL row object
 */
exports.serviceAlreadyAdded = async (service_id) => {
  const [rows] = await db.execute(
    `SELECT 
                          od.id AS order_details_id,
                          od.service_id,
                          oh.id AS order_header_id,
                          oh.order_status
                      FROM
                          order_details od
                              JOIN
                          order_header oh ON od.order_header_id = oh.id
                      WHERE
                          od.service_id = ?
                              AND oh.order_status = 'open'
                      LIMIT 1`,
    [service_id]
  );
  return rows.length ? rows[0] : null;
};

/**
 * Get order with open status
 * Delete row
 * @param {*} order_header_id 
 * @returns SQL row object
 */
exports.deleteOrderHeader = async (order_header_id) => {
  const [rows] = await db.execute(
    `DELETE FROM order_header WHERE id = ?`,
    [order_header_id]
  );
  return rows;
};

/**
 * Create order header
 * Get row object e.g order header
 * @returns SQL row
 */
exports.createOrderHeader = async () => {
  const [result] = await db.execute('INSERT INTO order_header () VALUES ()');
  return result;
};

/**
 * Create order details
 * Get rows object e.g order details
 * @param {*} order_header_id
 * @param {*} service_id
 * @returns SQL row
 */
exports.createOrderDetails = async (order_header_id, service_id) => {
  const [result] = await db.execute(
    'INSERT INTO order_details (order_header_id, service_id) VALUES (?, ?)',
    [order_header_id, service_id]
  );
  return result;
};

/**
 * Get order details
 * Get rows objects e.g order details
 * @param {*} order_header_id
 * @returns SQL row
 */
exports.getOrderDetails = async (order_header_id) => {
  const [result] = await db.execute(
    `SELECT 
          s.service_name,
          s.service_price,
          s.id AS service_id,
          od.id AS order_details_id,
          od.order_header_id,
          od.service_id
      FROM
          order_details od
              LEFT JOIN
          services s ON s.id = od.service_id
      WHERE
          od.order_header_id=?`,
    [order_header_id]
  );
  return result;
};

/**
 * Delete order details
 * @param {*} order_header_id
 * @param {*} service_id
 * @returns SQL row
 */
exports.deleteOrderDetails = async (order_header_id, service_id) => {
  const [result] = await db.execute(
    'DELETE FROM order_details WHERE order_header_id=? AND service_id=?',
    [order_header_id, service_id]
  );
  return result;
};

/**
 * Create order
 * @param {*} service_id
 * @returns Order ID
 */
exports.createOrder = async (service_id) => {
  // Call getOpenOrder once
  const openOrder = await this.getOpenOrder();

  // Use existing order ID or create a new one
  const orderId = openOrder?.id || (await this.createOrderHeader()).insertId;

  // Added service
  const addedService = await this.serviceAlreadyAdded(service_id);

  // If it is not added
  if (addedService == null) {
    // Create order details with service ID
    await this.createOrderDetails(orderId, service_id);
  } else {
    throw new Error('This service is already added.');
  }

  // Return order id
  return orderId;
};

/**
 * Get active order
 * @returns Object
 */
exports.getActiveOrder = async () => {
  // Find open order header
  const openOrder = await this.getOpenOrder();
  // No active order
  if (!openOrder) return {};
  // Fetch order details
  const orderDetails = await this.getOrderDetails(openOrder.id);
  // Return
  return {
    order_header: openOrder,
    order_details: orderDetails
  };
};

/**
 * Get order payments
 * @param {*} fromDate 
 * @param {*} toDate 
 * @returns Object
 */
exports.ordersPayments = async (fromDate, toDate) => {

  console.log("From date " + fromDate, "To date " + toDate);

  const [result] = await db.execute(
    `SELECT
              COUNT(CASE WHEN payment_type = 'cash' THEN 1 END) AS total_cash_payments,
              IFNULL(SUM(CASE WHEN payment_type = 'cash' THEN amount_collected END), 0) AS total_cash_amount,
              COUNT(CASE WHEN payment_type = 'cash' AND amount_collected_by_owner = 1 THEN 1 END) AS total_cash_collected,
              COUNT(CASE WHEN payment_type = 'cash' AND amount_collected_by_owner = 0 THEN 1 END) AS total_cash_not_collected,

              IFNULL(SUM(CASE WHEN payment_type = 'cash' AND amount_collected_by_owner = 1 THEN amount_collected END), 0) AS total_cash_amount_collected,
              IFNULL(SUM(CASE WHEN payment_type = 'cash' AND amount_collected_by_owner = 0 THEN amount_collected END), 0) AS total_cash_amount_not_collected,


              COUNT(CASE WHEN payment_type = 'card' THEN 1 END) AS total_card_payments,
              IFNULL(SUM(CASE WHEN payment_type = 'card' THEN amount_collected END), 0) AS total_card_amount,
              COUNT(CASE WHEN payment_type = 'card' AND amount_collected_by_owner = 1 THEN 1 END) AS total_card_collected,
              COUNT(CASE WHEN payment_type = 'card' AND amount_collected_by_owner = 0 THEN 1 END) AS total_card_not_collected,

              IFNULL(SUM(CASE WHEN payment_type = 'card' AND amount_collected_by_owner = 1 THEN amount_collected END), 0) AS total_card_amount_collected,
              IFNULL(SUM(CASE WHEN payment_type = 'card' AND amount_collected_by_owner = 0 THEN amount_collected END), 0) AS total_card_amount_not_collected

          FROM
              order_header
          WHERE
              order_closed_at >= ?
              AND order_closed_at < ?`,
    [fromDate, toDate]
  );

  return result.length ? result[0] : {
    total_cash_payments: 0,
    total_cash_amount: 0,
    total_card_payments: 0,
    total_card_amount: 0
  };

};


/**
 * Get closed orders
 * @param {*} fromDate 
 * @param {*} toDate 
 * @returns Object
 */
exports.closedOrders = async (fromDate, toDate) => {
  const [rows] = await db.execute(
    `SELECT 
              oh.id AS order_header_id,
              oh.payment_type,
              oh.payable_amount,
              oh.amount_collected,
              oh.balance_amount,
              oh.order_closed_at,
              oh.order_remarks,
              oh.amount_collected_by_owner,
              oh.amount_collected_by_owner_at,
              emp.employee_name,
              emp.id AS employee_id
          FROM
              order_header oh
                  LEFT JOIN
              employees emp ON oh.employee_id = emp.id
          WHERE
              order_closed_at >= ?
                  AND order_closed_at < ?
          ORDER BY oh.id DESC`,
    [fromDate, toDate]
  );
  return rows.length ? rows : null;
};

/**
 * Remove from order
 * Get rows object e.g order header and order details
 * @param {*} order_header_id
 * @param {*} service_id
 * @returns Boolean
 */
exports.removeFromOrder = async (order_header_id, service_id) => {

  // Find the order header
  const findOrderHeader = await this.findOrderHeader(order_header_id);

  // Delete order details
  await this.deleteOrderDetails(findOrderHeader.id, service_id);

  const deleteOrderHeader = await this.getOrderDetails(findOrderHeader.id);

  if (deleteOrderHeader.length < 1) {
    this.deleteOrderHeader(findOrderHeader.id);
  }
  // Return true
  return true;
};


/**
 * Update row
 * @param {*} amount_collected 
 * @param {*} employee_id 
 * @param {*} order_header_id 
 * @param {*} order_remarks 
 * @param {*} payable_amount 
 * @param {*} payment_type 
 * @returns SQL Object
 */
exports.closeOrder = async (amount_collected, employee_id, order_header_id, order_remarks, payable_amount, payment_type) => {

  let balance_amount = (amount_collected - payable_amount);

  const [result] = await db.execute(
    `UPDATE order_header 
        SET 
            employee_id = ?,
            payment_type = ?,
            payable_amount = ?,
            amount_collected = ?,
            balance_amount = ?,
            order_status = ?,
            order_remarks=?,
            order_closed_at = NOW(),
            created_at = NOW(),
            created_by = ?
        WHERE
            id = ?`,
    [employee_id, payment_type, payable_amount, amount_collected, balance_amount > 0 ? balance_amount : 0, 'closed', order_remarks, employee_id, order_header_id]
  );
  return result;
};

/**************************************************/
/********************BEGIN ADMIN*******************/
/**************************************************/

/**
 * Uncollect order
 * @param {*} order_header_id
 * @returns Void
 */
exports.adminMakeOrderBackup = async (order_header_id) => {

  const findOrderHeader = await this.findOrderHeaderWithAllColumns(order_header_id);

  const findOrderDetails = await this.findOrderDetailsWithAllColumns(order_header_id);

  if (findOrderHeader == null) {
    throw new Error("Order does not exist");
  }


  // Make order header history
  const [rows] = await db.execute(
    `INSERT INTO order_header_history (
        order_id,
        employee_id,
        payment_type,
        payable_amount,
        amount_collected,
        balance_amount,
        order_status,
        order_amendment_status,
        order_remarks,
        order_closed_at,
        amount_collected_by_owner,
        amount_collected_by_id,
        amount_collected_by_owner_at,
        created_at,
        created_by,
        updated_at,
        updated_by
    )
    values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
    [
      findOrderHeader.id,
      findOrderHeader.employee_id,
      findOrderHeader.payment_type,
      findOrderHeader.payable_amount,
      findOrderHeader.amount_collected,
      findOrderHeader.balance_amount,
      findOrderHeader.order_status,
      findOrderHeader.order_amendment_status,
      findOrderHeader.order_remarks,
      findOrderHeader.order_closed_at,
      findOrderHeader.amount_collected_by_owner,
      findOrderHeader.amount_collected_by_id,
      findOrderHeader.amount_collected_by_owner_at,
      findOrderHeader.created_at,
      findOrderHeader.created_by,
      findOrderHeader.updated_at,
      findOrderHeader.updated_by
    ]
  );

  findOrderDetails.map(async (detail, index) => {

    // Make order details history
    await db.execute(
      `INSERT INTO order_details_history ( 
          order_header_id,
          order_header_history_id,
          service_id,
          created_at,
          created_by,
          updated_at,
          updated_by
      )
      values(?, ?, ?, ?, ?, ?, ?)`,
      [
        findOrderHeader.id,
        rows.insertId,
        detail.service_id,
        detail.created_at,
        detail.created_by,
        detail.updated_at,
        detail.updated_by
      ]
    );

  });

};


/**
 * Collect order
 * @param {*} userId 
 * @param {*} orderIds 
 * @returns Void
 */
exports.adminCollectOrder = async (userId, orderIds) => {

  // Make order history
  await this.adminMakeOrderBackup(orderIds);

  const [result] = await db.execute(
    `UPDATE order_header 
        SET 
            order_amendment_status = "collect",
            amount_collected_by_owner=1,
            amount_collected_by_owner_at = NOW(),
            amount_collected_by_id = ?,
            updated_at = NOW(),
            updated_by = ?
        WHERE
            id in(?)`,
    [userId, userId, orderIds]
  );
  return result;
};

/**
 * Reopen order
 * @param {*} userId 
 * @param {*} orderIds 
 * @returns Void
 */
exports.adminReOpenOrder = async (userId, orderIds) => {

  // Make order history
  await this.adminMakeOrderBackup(orderIds);

  const [result] = await db.execute(
    `UPDATE order_header 
        SET 
            order_status = "open",
            order_closed_at = null,
            order_amendment_status = "re-open",
            amount_collected_by_owner=0,
            amount_collected_by_owner_at = null,
            amount_collected_by_id = null,
            updated_at = NOW(),
            updated_by = ?
        WHERE
            id in(?)`,
    [userId, orderIds]
  );

  // Make another order history
  await this.adminMakeOrderBackup(orderIds);

  return result;
};


/**
 * Uncollect order
 * @param {*} userId 
 * @param {*} orderIds 
 * @returns Void
 */
exports.adminUncollectOrder = async (userId, orderIds) => {

  // Make order history
  await this.adminMakeOrderBackup(orderIds);

  const [result] = await db.execute(
    `UPDATE order_header 
        SET 
            order_amendment_status = "uncollect",
            amount_collected_by_owner=0,
            amount_collected_by_owner_at = NULL,
            amount_collected_by_id = NULL,
            updated_at = NOW(),
            updated_by = ?
        WHERE
            id in(?)`,
    [userId, orderIds]
  );
  return result;
};

/**
 * Collect order
 * @param {*} userId
 * @param {*} fromDate
 * @param {*} toDate 
 * @returns Void
 */
exports.adminCollectBulkOrders = async (userId, fromDate, toDate) => {


  // Execute
  const [rows] = await db.execute(
    `select id from order_header
        WHERE
        amount_collected_by_owner = 0
        AND
            order_closed_at >= ?
            AND order_closed_at < ?`,
    [fromDate, toDate]
  );

  for (const row of rows) {

      //Collect
      await this.adminCollectOrder(userId, row.id);

  }

};


/**
 * Get order with id
 * Get single row
 * @param {*} order_header_id 
 * @returns SQL row object
 */
exports.findOrderHeaderWithEmployeeForAdmin = async (order_header_id) => {
  const [rows] = await db.execute(
    `SELECT 
          oh.id,
          oh.amount_collected_by_owner,
          oh.amount_collected_by_owner_at,
          employee_id,
          payment_type,
          payable_amount,
          amount_collected,
          balance_amount,
          order_status,
          order_closed_at,
          emp.employee_name,
          emp.is_active,
          order_remarks
      FROM
          order_header oh
              LEFT JOIN
          employees emp ON emp.id = oh.employee_id
      WHERE
          oh.id = ?`,
    [order_header_id]
  );
  return rows.length ? rows[0] : null;
};

/**************************************************/
/**********************END ADMIN*******************/
/**************************************************/
