/**
 * Employees
 * It will be used for the backend
 * It contains all the methods related to the employees
 */

// Require
const db = require('../db');

/**
 * Get order with open status
 * Get single row
 * @returns Array of objects
 */
exports.fetchActiveEmployees = async () => {
    // SQL
    const SQL = `select * from employees where is_active=?`;
    // Execute
    const [employees] = await db.query(SQL, [1]);
    // Return
    return employees.length ? employees : [];
};

/**
 * Get order with open status
 * Get single row
 * @param {*} id
 * @returns Array of objects
 */
exports.findActiveEmployeeById = async (id) => {
    // SQL
    const SQL = `select * from employees where id=? and is_active=?`;
    // Execute
    const [employees] = await db.query(SQL, [id, 1]);
    // Return
    return employees.length ? employees : [];
};

/**
 * Get employee sales
 * @param {*} fromDate 
 * @param {*} toDate 
 * @returns Array of objects
 */
exports.employeeSales = async (fromDate, toDate) => {
    // Execute
    const [result] = await db.execute(
        `SELECT 
            emp.id AS employee_id,
            emp.employee_name,

            COUNT(CASE
                WHEN oh.payment_type = 'cash' THEN 1
            END) AS total_cash_payments,

            COUNT(CASE
                WHEN oh.payment_type = 'card' THEN 1
            END) AS total_card_payments,

            SUM(CASE
                WHEN oh.payment_type = 'cash' THEN oh.amount_collected
                ELSE 0
            END) AS total_cash_collected,

            SUM(CASE
                WHEN oh.payment_type = 'card' THEN oh.amount_collected
                ELSE 0
            END) AS total_card_collected,

            SUM(CASE 
                WHEN oh.amount_collected IS NOT NULL THEN oh.amount_collected 
                ELSE 0
            END) AS total_collected

        FROM
            employees emp
        LEFT JOIN
            order_header oh ON oh.employee_id = emp.id
            AND oh.order_closed_at >= ?
            AND oh.order_closed_at < ?

        WHERE
            emp.is_active = 1

        GROUP BY 
            emp.id, emp.employee_name

        ORDER BY 
            total_collected DESC`,
        [fromDate, toDate]
    );
    // Return
    return result;
};
