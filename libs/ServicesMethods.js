/**
 * Orders
 * It will be used for the backend
 * It contains all the methods related to the orders
 */

// Require
const db = require('../db');


/**************************************************/
/********************BEGIN ADMIN*******************/
/**************************************************/
/**
 * Get service
 * Get single row
 * @returns Object
 */
exports.adminFetchServices = async () => {
    // SQL
    const SQL = `SELECT * FROM services`;
    // Execute
    const [services] = await db.execute(SQL);
    // Return
    return services.length ? services : [];
};

/**
 * Update service
 * @param {*} id
 * @param {*} service_name 
 * @param {*} service_price 
 * @param {*} is_active 
 * @param {*} updated_by 
 * @returns Void
 */
exports.adminUpdateService = async (id, service_name, service_price, is_active, updated_by) => {
    const SQL = `
        UPDATE services 
        SET service_name = ?, service_price = ?, is_active = ?, updated_at = NOW(), updated_by = ?
        WHERE id = ?
    `;
    await db.execute(SQL, [service_name, service_price, is_active, updated_by, id]);
};


/**
 * Add service
 * @param {*} service_name 
 * @param {*} service_price 
 * @param {*} is_active 
 * @param {*} created_by 
 * @returns Void
 */
exports.adminAddService = async (service_name, service_price, is_active, created_by) => {
    // SQL
    const SQL = `INSERT INTO services(service_name, service_price, is_active, created_at, created_by) VALUES(?, ?, ?, NOW(), ?)`;
    // Execute
    await db.execute(SQL, [service_name, service_price, is_active, created_by]);
};
/**************************************************/
/**********************END ADMIN*******************/
/**************************************************/





/**
 * Get order with open status
 * Get single row
 * @returns Array of objects
 */
exports.fetchActiveServices = async () => {
    // SQL
    const SQL = `SELECT 
                    s.id AS service_id,
                    s.service_name,
                    s.service_price,
                    (
                        SELECT oh.id
                        FROM order_details od
                        JOIN order_header oh ON oh.id = od.order_header_id
                        WHERE od.service_id = s.id AND oh.order_status = 'open'
                        LIMIT 1
                    ) AS order_header_id,
                    CASE
                        WHEN EXISTS (
                            SELECT 1
                            FROM order_details od
                            JOIN order_header oh ON oh.id = od.order_header_id
                            WHERE od.service_id = s.id AND oh.order_status = 'open'
                        ) THEN 1
                        ELSE 0
                    END AS added_to_order
                FROM
                    services s
                WHERE
                    s.is_active = 1`;

    const [services] = await db.execute(SQL);
    // Return
    return services.length ? services : [];
};

/**
 * Get employee sales
 * @param {*} fromDate 
 * @param {*} toDate 
 * @returns Array of objects
 */
exports.serviceSales = async (fromDate, toDate) => {
    // Execute
    const [result] = await db.execute(
        `SELECT 
            s.id AS service_id,
            s.service_name,
            COUNT(CASE
                WHEN
                    oh.order_closed_at >= ?
                        AND oh.order_closed_at < ?
                THEN
                    od.id
            END) AS times_used,
            SUM(CASE
                WHEN
                    oh.order_closed_at >= ?
                        AND oh.order_closed_at < ?
                THEN
                    s.service_price
                ELSE 0
            END) AS amount_collected
        FROM
            services s
                LEFT JOIN
            order_details od ON od.service_id = s.id
                LEFT JOIN
            order_header oh ON oh.id = od.order_header_id
        GROUP BY s.id , s.service_name
        ORDER BY times_used DESC`,
        [fromDate, toDate, fromDate, toDate]
    );
    // Return
    return result;
};
