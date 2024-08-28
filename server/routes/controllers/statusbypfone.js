const db = require('../config/db'); // Your database configuration file

const getApplicantDetailsByMobile = async (req, res) => {
    const { mobileNumber } = req.params; // Assuming the mobile number is passed as a query parameter
    console.log("hii....123.45")
    console.log(mobileNumber)
    // Validate that the mobile number is provided
    if (!mobileNumber) {
        return res.status(400).json({ error: 'Mobile number is required' });
    }

    try {
        // Query to fetch applicant details by mobile number
        const query = `
      SELECT
        name,
        email,
        status
      FROM
        applicant_referrals
      WHERE
        phone = ?
    `;

        // Execute the query
        const [rows] = await db.query(query, [mobileNumber]);

        // Check if applicant is found
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Applicant not found' });
        }

        // Return applicant details
        const applicantDetails = rows[0];
        res.status(200).json(applicantDetails);
    } catch (error) {
        console.error('Database Error:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching applicant details' });
    }
};

module.exports = {
    getApplicantDetailsByMobile,
};
