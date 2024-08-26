// testConnection.js
const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.PORT || 3306 // Default MySQL port
});

const promisePool = pool.promise();

// Test the connection
async function testConnection() {
    try {
        const [rows] = await promisePool.query('SELECT 1 + 1 AS result');
        console.log('Database connection successful. Result:', rows[0].result);
    } catch (error) {
        console.error('Database connection failed:', error.message);
    } finally {
        pool.end();
    }
}

testConnection();
