const db = require('../config/db');

const getApplicantsForScreening = async (req, res) => {
    const { userId } = req.params;

    try {
        // Step 1: Get Work Locations for the User
        const [locationsResult] = await db.query(
            `SELECT wl.id AS work_location_id
             FROM work_locations wl
             JOIN user_work_locations uwl ON wl.id = uwl.work_location_id
             WHERE uwl.user_id = ?`,
            [userId]
        );


        
        console.log('Locations Result:', locationsResult); // Debugging statement

        if (locationsResult.length === 0) {
            return res.status(404).json({ message: 'No locations found for the user.' });
        }

        // Extract location IDs
        const locationIds = locationsResult.map(location => location.work_location_id);
console.log(locationIds)
        // Step 2: Get Applicants for These Locations
        const [applicantsResult] = await db.query(
            `SELECT ar.id AS applicant_id, ar.applicant_uuid, ar.name AS applicant_name, ar.email AS applicant_email, ar.phone AS applicant_phone, ar.referred_by, ar.reference_id, ar.created_at
             FROM applicant_referrals ar
             WHERE ar.work_location IN (?)`,
            [locationIds]
        );

        res.status(200).json(applicantsResult);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getApplicantsForScreening };
