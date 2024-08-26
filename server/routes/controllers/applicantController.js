const db = require('../config/db');
const crypto = require('crypto');

const generateShortID = (name, phoneNumber, currentYear) => {
    const rawString = `${name}-${phoneNumber}-${currentYear}`;
    const hash = crypto.createHash('md5').update(rawString).digest('hex');
    // Take the first 8 characters to ensure it's under 10 characters
    return hash.substring(0, 8).toUpperCase();
};

const createApplicantReferral = async (req, res) => {
    const { name, email, phone, referred_by, reference_id, work_location } = req.body;
    const currentYear = new Date().getFullYear();
    const uuid = generateShortID(name, phone, currentYear);
    console.log("trying to submit..........", name, email, phone, referred_by, reference_id, work_location )
    try {
        // Fetch the work location ID based on the location name
        const [locationResult] = await db.query(
            'SELECT id FROM work_locations WHERE location_name = ?',
            [work_location]
        );

        // Check if the location was found
        if (locationResult.length === 0) {
            return res.status(400).json({ error: 'Invalid work location' });
        }

        const locationId = locationResult[0].id;

        // Insert the applicant details into the applicant_referrals table
        const result = await db.query(
            'INSERT INTO applicant_referrals (applicant_uuid, name, email, phone, referred_by, reference_id, work_location, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
            [uuid, name, email, phone, referred_by, reference_id, locationId]
        );

        res.status(201).json({ message: 'Applicant referral created successfully', referralId: result.insertId });
    } catch (error) {
        console.error('Error creating applicant referral:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createApplicantReferral };
