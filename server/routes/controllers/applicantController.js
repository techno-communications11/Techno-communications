const db = require('../config/db');
const crypto = require('crypto');

const generateShortID = (name, phoneNumber, currentYear) => {
    const rawString = `${name}-${phoneNumber}-${currentYear}`;
    const hash = crypto.createHash('md5').update(rawString).digest('hex');
    // Take the first 8 characters to ensure it's under 10 characters
    return hash.substring(0, 8).toUpperCase();
};

const createApplicantReferral = async (req, res) => {
    const { name, email, phone, referred_by, reference_id, sourcedBy, work_location } = req.body;
    const currentYear = new Date().getFullYear();
    const uuid = generateShortID(name, phone, currentYear);
    // console.log("Trying to submit..........", name, email, phone, referred_by, reference_id, work_location);

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

        // Check for duplicate phone number or email
        const [existingApplicants] = await db.query(
            'SELECT * FROM applicant_referrals WHERE  phone = ?',
            [phone]
        );

        if (existingApplicants.length > 0) {
            return res.status(400).json({ error: 'Applicant with the same phone number  already exists' });
        }

        // Insert the applicant details into the applicant_referrals table
        const result = await db.query(
            'INSERT INTO applicant_referrals (applicant_uuid, name, email, phone, referred_by, sourced_by, reference_id, work_location, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
            [uuid, name, email, phone, referred_by, sourcedBy, reference_id, locationId]
        );

        res.status(201).json({ message: 'Applicant referral created successfully', referralId: result.insertId });
    } catch (error) {
        console.error('Error creating applicant referral:', error);
        res.status(500).json({ error: error.message });
    }
};


const updatemail = async (req, res) => {
    const { applicant_uuid, email } = req.body; // Ensure you receive the unique identifier (like applicant_uuid)

    // console.log(email, applicant_uuid);

    try {
        // Perform the SQL query to update the email in the applicant_referrals table
        const result = await db.query(
            `UPDATE applicant_referrals
         SET email = ? 
         WHERE applicant_uuid = ?`,
            [email, applicant_uuid] // Using parameterized queries to prevent SQL injection
        );
        const affectedRows = result[0]?.affectedRows; // Access the 'affectedRows' inside the first object of the array

        // Check if the query successfully affected any rows
        if (affectedRows > 0) {
            res.status(200).json({ message: 'Email updated successfully.' });
        } else {
            res.status(404).json({ message: 'Applicant not found or no changes made.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating email.' });
    }
};


module.exports = { createApplicantReferral, updatemail };
