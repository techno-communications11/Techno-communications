const db = require('../config/db'); // Your database configuration file


const trackingWork = async (req, res) => {
    // console.log("hi trackijnf")
    const { startDate, endDate, userId } = req.params; // Use req.query to extract query parameters

    if (!startDate || !endDate || !userId) {
        return res.status(400).json({ error: 'Missing required query parameters.' });
    }

    try {
        const sql = `
        SELECT 
            ar.applicant_uuid,
            ar.status AS referral_status,  -- Taking the status from the applicant_referrals table
            i.time_of_interview AS interview_time,  -- Fetching other relevant columns from interviews table
            hr.time_of_hrinterview AS hr_interview_time  -- Fetching other relevant columns from hrinterview table
        FROM applicant_referrals ar
        LEFT JOIN interviews i ON ar.applicant_uuid = i.applicant_uuid
            AND i.created_at BETWEEN ? AND ?  -- Using placeholders for date range
        LEFT JOIN hrinterview hr ON ar.applicant_uuid = hr.applicant_uuid
            AND hr.created_at BETWEEN ? AND ?  -- Using placeholders for date range
        WHERE ar.assigned_user_id = ?
            AND ar.created_at BETWEEN ? AND ?;  -- Using placeholders for date range
    `;


        const [results] = await db.query(sql, [startDate, endDate, startDate, endDate, userId, startDate, endDate]);

        // Get the number of rows in the results
        const count = results.length;

        // Add the count to the results array
        let updatedResults = {
            data: results,
            count: count
        };

        // Return the updated result with the count
        res.json(updatedResults);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });

    }

};












module.exports = {
    trackingWork
}