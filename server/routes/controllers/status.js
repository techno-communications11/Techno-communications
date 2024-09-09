const db = require("../config/db")


const statusupdate = async (req, res) => {
  const { applicant_uuid, action } = req.body;

  console.log("Status update request received for applicant:", applicant_uuid, "with action:", action);

  try {
    // Assuming you're using a MySQL database connection (mysql2/promise)
    const [result] = await db.query(
      'UPDATE applicant_referrals SET status = ? WHERE applicant_uuid = ?',
      [action, applicant_uuid]
    );

    // Check if any rows were updated
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Status updated successfully.' });
      console.log("Status updated successfully")
    } else {
      res.status(404).json({ error: 'Applicant not found.' });
    }
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'An error occurred while updating the status.' });
  }
};



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

    // Execute the query3
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
  getStatusCounts,
  statusupdate
}