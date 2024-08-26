// models/userModel.js
const db = require('../config/db');

const getUsers = async () => {
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
};

module.exports = { getUsers };
