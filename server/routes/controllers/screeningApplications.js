const db = require('../config/db');
// const { io } = require('../../app');

const getApplicantsForScreening = async (req, res) => {
    const { userId } = req.params;

    try {
        // console.log('Fetching work locations for user:', userId);

        // Step 1: Get Work Locations for the User
        const [locationsResult] = await db.query(
            `SELECT wl.id AS work_location_id
             FROM work_locations wl
             JOIN user_work_locations uwl ON wl.id = uwl.work_location_id
             WHERE uwl.user_id = ?`,
            [userId]
        );

        if (locationsResult.length === 0) {
            return res.status(404).json({ message: 'No work locations found for the user.' });
        }

        // Extract location IDs
        const locationIds = locationsResult.map(location => location.work_location_id);

        // Step 2: Get Users for These Locations
        const [usersResult] = await db.query(
            `SELECT DISTINCT uwl.user_id
             FROM user_work_locations uwl
             WHERE uwl.work_location_id IN (?)`,
            [locationIds]
        );

        if (usersResult.length === 0) {
            return res.status(404).json({ message: 'No users found for the locations.' });
        }

        // Extract unique user IDs
        const userIds = [...new Set(usersResult.map(user => user.user_id))];
        // console.log('User IDs:', userIds);

        if (userIds.length === 0) {
            return res.status(404).json({ message: 'No user IDs available for assignment.' });
        }

        // Step 3: Get Applicants for These Locations
        const [applicantsResult] = await db.query(
            `SELECT ar.id AS applicant_id, ar.applicant_uuid, ar.name AS applicant_name, ar.email AS applicant_email, 
                    ar.phone AS applicant_phone, ar.referred_by, ar.reference_id, ar.created_at
             FROM applicant_referrals ar
             WHERE ar.work_location IN (?)
             AND ar.status = 'pending at screening';`,
            [locationIds]
        );

        if (applicantsResult.length === 0) {
            return res.status(404).json({ message: 'No applicants found for the given locations.' });
        }

        // Step 4: Distribute Applicants in Round-Robin Fashion
        let currentUserIndex = 0;
        const assignments = applicantsResult.map(applicant => {
            const assignedUserId = userIds[currentUserIndex];
            currentUserIndex = (currentUserIndex + 1) % userIds.length;
            return [assignedUserId, applicant.applicant_uuid];
        });

        // Construct individual update queries
        const updatePromises = assignments.map(([assignedUserId, applicantUuid]) =>
            db.query(
                `UPDATE applicant_referrals 
                 SET assigned_user_id = COALESCE(assigned_user_id, ?) 
                 WHERE applicant_uuid = ?`,
                [assignedUserId, applicantUuid]
            )
        );

        // Execute all update queries
        await Promise.all(updatePromises);

        // Step 5: Fetch Applicants assigned to the current user (after assignment)
        const [finalApplicants] = await db.query(
            `SELECT id AS applicant_id, applicant_uuid, name AS applicant_name, email AS applicant_email, 
                    phone AS applicant_phone, referred_by, reference_id, created_at, assigned_user_id
             FROM applicant_referrals 
             WHERE assigned_user_id = ?
             AND status = 'pending at screening';`,
            [userId]
        );

        // Return the filtered applicants
        res.status(200).json(finalApplicants);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};



const assignApplicantToUser = async (req, res) => {
    const { applicantId, newUserId,comment } = req.body;  // Extract from request body
    console.log(">>>>>>", applicantId, newUserId,comment)
    try {
        // Step 1: Check if the applicant exists
        const [applicantResult] = await db.query(
            `SELECT applicant_uuid FROM applicant_referrals WHERE applicant_uuid = ?`,
            [applicantId]
        );

        if (applicantResult.length === 0) {
            return res.status(404).json({ message: 'Applicant not found.' });
        }

        // Step 2: Check if the new user exists
        const [userResult] = await db.query(
            `SELECT id FROM users WHERE id = ?`,
            [newUserId]
        );

        if (userResult.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Step 3: Update the applicant assignment
        await db.query(
            `UPDATE applicant_referrals 
             SET assigned_user_id = ? ,comments = ?
             WHERE applicant_uuid = ?`,
            [newUserId, comment, applicantId]
        );

        res.status(200).json({ message: 'Applicant successfully assigned to the new user.' });
    } catch (error) {
        console.error('Error during applicant reassignment:', error);
        res.status(500).json({ error: error.message });
    }
};


const assignnewHr= async (req, res) => {
    const { applicantId, newUserId } = req.body;  // Extract from request body
    // console.log(">>>>>>", applicantId, newUserId)
    try {
        // Step 1: Check if the applicant exists
        const [applicantResult] = await db.query(
            `SELECT applicant_uuid FROM applicant_referrals WHERE applicant_uuid = ?`,
            [applicantId]
        );

        if (applicantResult.length === 0) {
            return res.status(404).json({ message: 'Applicant not found.' });
        }

        // Step 2: Check if the new user exists
        const [userResult] = await db.query(
            `SELECT id FROM users WHERE id = ?`,
            [newUserId]
        );

        if (userResult.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Step 3: Update the applicant assignment
        await db.query(
            `UPDATE hrinterview 
             SET hr_id = ? 
             WHERE applicant_uuid = ?`,
            [newUserId, applicantId]
        );

        res.status(200).json({ message: 'Applicant successfully assigned to the new hr.' });
    } catch (error) {
        console.error('Error during applicant reassignment:', error);
        res.status(500).json({ error: error.message });
    }
};


const assignnewInterviewer = async (req, res) => {
    const { applicantId, newUserId } = req.body;  // Extract from request body
    // console.log(">>>>>>", applicantId, newUserId)
    try {
        // Step 1: Check if the applicant exists
        const [applicantResult] = await db.query(
            `SELECT applicant_uuid FROM applicant_referrals WHERE applicant_uuid = ?`,
            [applicantId]
        );

        if (applicantResult.length === 0) {
            return res.status(404).json({ message: 'Applicant not found.' });
        }

        // Step 2: Check if the new user exists
        const [userResult] = await db.query(
            `SELECT id FROM users WHERE id = ?`,
            [newUserId]
        );

        if (userResult.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Step 3: Update the applicant assignment
        await db.query(
            `UPDATE  interviews 
             SET interviewer_id  = ? 
             WHERE applicant_uuid = ?`,
            [newUserId, applicantId]
        );

        res.status(200).json({ message: 'Applicant successfully assigned to the new interviewer.' });
    } catch (error) {
        console.error('Error during applicant reassignment:', error);
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    getApplicantsForScreening, assignApplicantToUser,assignnewHr,assignnewInterviewer
}