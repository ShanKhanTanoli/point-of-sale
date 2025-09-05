// Require
const mysql = require('mysql2');

// Require
require('dotenv').config();

// Create a pool of connections
const pool = mysql.createPool({
  host: process.env.HOST,              // Hostname (e.g., 'localhost' or IP)
  user: process.env.DB_USER,           // MySQL user
  password: process.env.DB_PASSWORD,   // User's password
  database: process.env.DB_NAME,       // DB name to use
  waitForConnections: true,            // Wait (instead of throwing error) if pool is full
  connectionLimit: 10,                 // Max number of active connections in pool
  queueLimit: 0                        // Max number of queued connection requests (0 = unlimited)
}).promise();


// Error handling
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL using connection pool.');
    connection.release();
  } catch (err) {
    console.error('❌ Failed to connect to MySQL:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.error('💡 Check if MySQL server is running.');
    }
    process.exit(1);
  }
})();


module.exports = pool;
