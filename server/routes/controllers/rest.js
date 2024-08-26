const db = require('../config/db');

const testQuery = async () => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        console.log('Test Query Result:', rows);
    } catch (error) {
        console.error('Test Query Error:', error.message);
    }
};

testQuery();
