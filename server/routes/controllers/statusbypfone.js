const db = require('../config/db'); // Your database configuration file

const getApplicantDetailsByMobile = async (req, res) => {
    let { mobileNumber } = req.params; // Use let for reassignment
    console.log("Received Mobile Number:", mobileNumber);

    // Validate that the mobile number is provided
    if (!mobileNumber) {
        return res.status(400).json({ error: 'Mobile number is required' });
    }

    // Sanitize the mobile number to remove special characters
    mobileNumber = sanitizeMobileNumber(mobileNumber);

    try {
        // Query to fetch applicant details and screening manager's name by mobile number
        const query = `
            SELECT
                ar.name,
                ar.email,
                ar.status,
                ar.assigned_user_id,
                u.name AS screening_manager_name
            FROM
                applicant_referrals ar
            LEFT JOIN
                users u ON ar.assigned_user_id = u.id
            WHERE
                REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(ar.phone, '+', ''), '(', ''), ')', ''), '-', ''), ' ', '') = ?
               OR REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(ar.phone, '+', ''), '(', ''), ')', ''), '-', ''), ' ', '') LIKE ?
        `;

        // Execute the query. The second condition (LIKE) matches numbers like +1XXXXXXXXXX or 1XXXXXXXXXX
        const [rows] = await db.query(query, [mobileNumber, `%${mobileNumber}`]);

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

// Helper function to sanitize mobile number
const sanitizeMobileNumber = (mobileNumber) => {
    // Remove non-numeric characters from the mobile number
    return mobileNumber.replace(/\D/g, '');
};

module.exports = {
    getApplicantDetailsByMobile,
};
