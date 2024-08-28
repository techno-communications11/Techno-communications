const db = require("../config/db")


const getStatusCounts = async (req, res) => {
    try {
        // Get a connection from the pool
        // const connection = await pool.getConnection();

        // Query to count the number of applicants by status and total number of applicants
        const query = `
            SELECT status, COUNT(*) AS count, total_count
            FROM applicant_referrals
            JOIN (SELECT COUNT(*) AS total_count FROM applicant_referrals) AS total
            GROUP BY status, total_count
        `;

        // Execute the query
        const [rows] = await db.query(query);

        // Release the connection
        // connection.release();

        // Send the response with status counts and total count
        res.status(200).json(rows);
    } catch (error) {
        // Handle any errors
        console.error('SQL Error:', error.message);
        res.status(500).json({ error: error.message });
    }
};
module.exports = {
    getStatusCounts
}