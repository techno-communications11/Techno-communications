const db = require('../config/db');
const crypto = require('crypto');

// Function to generate a short unique ID based on the applicant's details
const generateShortID = (name, phoneNumber, currentYear) => {
    const rawString = `${name}-${phoneNumber}-${currentYear}`;
    const hash = crypto.createHash('md5').update(rawString).digest('hex');
    return hash.substring(0, 8).toUpperCase(); // Use the first 8 characters of the hash
};

// Controller to handle applicant referrals
const DirectReferal = async (req, res) => {
    try {
        const { name, email, phone, referred_by, reference_id, sourcedBy, assign_to } = req.body;
        const currentYear = new Date().getFullYear();
        const uuid = generateShortID(name, phone, currentYear);

        console.log("Submitting applicant referral:", name, email, phone, referred_by, reference_id, assign_to);

        // Insert the applicant details into the applicant_referrals table
        const result = await db.query(
            'INSERT INTO applicant_referrals (applicant_uuid, name, email, phone, referred_by, sourced_by, reference_id, assigned_user_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
            [uuid, name, email, phone, referred_by, sourcedBy, reference_id, assign_to]
        );

        res.status(201).json({ message: 'Applicant referral created successfully', referralId: result.insertId });
    } catch (error) {
        console.error('Error creating applicant referral:', error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
};
const getApplicantsForDirect = async (req, res) => {
    const { userId } = req.params; // Extract the userId from the request parameters

    try {
        console.log('Fetching applicants for user:', userId);

        // Fetch the applicants assigned to the current user with the status 'pending at screening'
        const [applicants] = await db.query(
            `SELECT 
                id AS applicant_id, 
                applicant_uuid, 
                name AS applicant_name, 
                email AS applicant_email, 
                phone AS applicant_phone, 
                referred_by, 
                reference_id, 
                created_at, 
                assigned_user_id
             FROM 
                applicant_referrals
             WHERE 
                assigned_user_id = ? 
             AND 
                status = 'pending at screening';`, // Fetch only applicants with 'pending at screening' status
            [userId]
        );

        // If no applicants are found, return a message indicating that
        if (applicants.length === 0) {
            return res.status(404).json({ message: 'No applicants found for this user with status pending at screening.' });
        }

        // Return the filtered applicants in the response
        return res.status(200).json(applicants);

    } catch (error) {
        console.error('Error fetching applicants:', error);

        // Send a 500 status with the error message in case of an exception
        return res.status(500).json({ error: 'Failed to fetch applicants. Please try again later.' });
    }
};


module.exports = { DirectReferal ,getApplicantsForDirect};
