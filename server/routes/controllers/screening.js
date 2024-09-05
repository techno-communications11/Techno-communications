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
             WHERE ar.work_location IN (?)
             AND ar.status = 'pending at screening';`,
            [locationIds]
        );

        res.status(200).json(applicantsResult);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};

const getApplicantsofScreening = async (req, res) => {
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
            `SELECT ar.id AS applicant_id, ar.applicant_uuid, ar.name AS applicant_name, ar.email AS applicant_email, ar.phone AS applicant_phone, ar.referred_by, ar.created_at, ar.status
             FROM applicant_referrals ar
             WHERE ar.work_location IN (?)`,
            [locationIds]
        );
        
        // Format the `created_at` field for each applicant
        const formattedApplicantsResult = applicantsResult.map(applicant => ({
            ...applicant,
            created_at: new Date(applicant.created_at).toLocaleString('en-US', { hour12: true }) // Format as desired
            // {new Date(profile.time_of_hrinterview).toLocaleString('en-US', { hour12: true })}
        }));
        
        // Log the formatted results (for debugging)
        console.log(formattedApplicantsResult);
        
        // Send the formatted data as the response
        res.status(200).json(formattedApplicantsResult);
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};

const getApplicationforinterviewr = async (req, res) => {

    const { userId } = req.params;
    console.log("trying get applicants for interviewer......")
    try {
        // Step 1: Get Work Locations for the User
        const [applicantsResult] = await db.query(
            `SELECT 
    interviews.applicant_uuid,
    interviews.time_of_interview,
    applicant_referrals.name AS applicant_name
FROM 
    interviews
JOIN 
    applicant_referrals ON interviews.applicant_uuid = applicant_referrals.applicant_uuid
WHERE 
    interviews.interviewer_id = ?
    AND applicant_referrals.status = 'moved to Interview';
`,
            [userId]
        );

        res.status(200).json(applicantsResult);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }

};
const getApplicationforhr = async (req, res) => {

    const { userId } = req.params;
    console.log("trying get applicants for hr......")
    try {
        // Step 1: Get Work Locations for the User
        const [applicantsResult] = await db.query(
            `SELECT 
            hrinterview.applicant_uuid,
    hrinterview.time_of_hrinterview,
    applicant_referrals.name AS applicant_name
    FROM 
    hrinterview
JOIN 
 applicant_referrals ON hrinterview.applicant_uuid = applicant_referrals.applicant_uuid
   WHERE 
    hrinterview.hr_id = 6
    AND applicant_referrals.status = 'Moved to HR';
 `,
            [userId]
        );

        res.status(200).json(applicantsResult);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }

};



const getApplicationforTrainer = async (req, res) => {

    const { userId } = req.params;
    console.log(`trying get applicants for Trainer......for ${userId}`)
    try {
        // Step 1: Get Work Locations for the User
        const [applicantsResult] = await db.query(
            `SELECT 
     training_sessions.applicant_uuid,
    
    applicant_referrals.name AS applicant_name
FROM 
     training_sessions
JOIN 
    applicant_referrals ON  training_sessions.applicant_uuid = applicant_referrals.applicant_uuid
WHERE 
     training_sessions.trainer_id = ?
    AND applicant_referrals.status = 'Sent for Evaluation';
`,
            [userId]
        );

        res.status(200).json(applicantsResult);
        console.log(applicantsResult)
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }

};


const gertrainerfeedbackapplicants = async (req,res) => {

    const { userId } = req.params;
    console.log("trying get applicants for hr trined applicants......")
    try {
        // Step 1: Get Work Locations for the User
        const [applicantsResult] = await db.query(
            `SELECT 
    hrinterview.applicant_uuid,
    hrinterview.time_of_hrinterview,
    applicant_referrals.status AS applicant_status,
    applicant_referrals.name AS applicant_name
   
FROM 
    hrinterview
JOIN 
    applicant_referrals ON hrinterview.applicant_uuid = applicant_referrals.applicant_uuid
WHERE 
    hrinterview.hr_id = 6
    AND applicant_referrals.status IN ('Recommended For Hiring', 'Not Recommended For Hiring');
;
     
 `,
            [userId]
        );

        res.status(200).json(applicantsResult);
        console.log(applicantsResult)
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }


}









module.exports = { getApplicantsForScreening, getApplicationforinterviewr, getApplicationforhr, getApplicantsofScreening, getApplicationforTrainer, gertrainerfeedbackapplicants };
