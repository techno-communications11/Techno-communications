const db = require("../testConnection");

const getApplicantsofScreening = async (req, res) => {
  const { userId } = req.params;
  console.log(userId,"ids");

  try {
    // Step 1: Get Work Locations for the User
    const [locationsResult] = await db.query(
      `SELECT wl.id AS work_location_id
             FROM work_locations wl
             JOIN user_work_locations uwl ON wl.id = uwl.work_location_id
             WHERE uwl.user_id = ?`,
      [userId]
    );

    // console.log('Locations Result:', locationsResult); // Debugging statement

    if (locationsResult.length === 0) {
      return res
        .status(404)
        .json({ message: "No locations found for the user." });
    }

    // Extract location IDs
    const locationIds = locationsResult.map(
      (location) => location.work_location_id
    );
    // console.log(locationIds)
    // Step 2: Get Applicants for These Locations
    const [applicantsResult] = await db.query(
      `SELECT 
            ar.id AS applicant_id,
            ar.applicant_uuid,
              ar.name AS applicant_name,
              ar.email AS applicant_email,
               ar.phone AS applicant_phone,
                ar.referred_by, 
                ar.created_at,  
                 ar.status
             FROM applicant_referrals ar
             WHERE ar.work_location IN (?)`,
      [locationIds]
    );


    // Format the `created_at` field for each applicant
    const formattedApplicantsResult = applicantsResult.map((applicant) => ({
      ...applicant,
      created_at: new Date(applicant.created_at).toLocaleString("en-US", {
        hour12: true,
      }), // Format as desired
      // {new Date(profile.time_of_hrinterview).toLocaleString('en-US', { hour12: true })}
    }));
     console.log(formattedApplicantsResult,"ddddddddd");

  
    res.status(200).json(formattedApplicantsResult);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getApplicationforinterviewr = async (req, res) => {
  const { userId } = req.params;
  // console.log("trying get applicants for interviewer......")
  try {
    // Step 1: Get Work Locations for the User
    const [applicantsResult] = await db.query(
      `SELECT 
    interviews.applicant_uuid,
    interviews.time_of_interview,
    applicant_referrals.name AS applicant_name,
    applicant_referrals.email AS email,
     applicant_referrals.phone AS phone

    
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
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};
const getApplicationforhr = async (req, res) => {
  const { userId } = req.params;
  // console.log("trying get applicants for hr......11   ")
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
    hrinterview.hr_id = ?   
    AND applicant_referrals.status = 'Moved to HR';
 `,
      [userId]
    );

    res.status(200).json(applicantsResult);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};
const getAllApplicationsForHR = async (req, res) => {
  // console.log("Trying to get applicants for all HRs with HR names...");

  try {
    // Step 1: Get applicants for all HRs and include HR name from the users table
    const [applicantsResult] = await db.query(
      `SELECT 
                hrinterview.applicant_uuid,
                hrinterview.hr_id,
                hrinterview.time_of_hrinterview,
                applicant_referrals.name AS applicant_name,
                users.name AS hr_name  -- Fetch HR name from users table
            FROM 
                hrinterview
            JOIN 
                applicant_referrals ON hrinterview.applicant_uuid = applicant_referrals.applicant_uuid
            JOIN 
                users ON hrinterview.hr_id = users.id  -- Join with users table to get HR name
            WHERE 
                applicant_referrals.status = 'Moved to HR';`
    );

    res.status(200).json(applicantsResult);
    // console.log(applicantsResult);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getApplicationforallhr = async (req, res) => {
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
    hrinterview.hr_id = ?   
    AND applicant_referrals.status = 'Moved to HR';
 `,
      [userId]
    );

    res.status(200).json(applicantsResult);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getApplicationforTrainer = async (req, res) => {
  const { userId } = req.params;
  // console.log(`trying get applicants for Trainer......for ${userId}`)
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
    // console.log(applicantsResult)
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllTrainerFeedbackApplicants = async (req, res) => {
  const { userId } = req.params;

  try {
    // Step 1: Get applicants based on status and HR ID
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
          hrinterview.hr_id = ?
          AND applicant_referrals.status IN ('Spanish Evaluation', 'Store Evaluation', 'Applicant will think about It');`,
      [userId]
    );

    res.status(200).json(applicantsResult);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};


const getAllTrainerFeedbackApplicantDetails = async (req, res) => {
  // console.log("Trying to get applicants for all HRs with HR names...");
   console.log('got it')

  try {
    // Step 1: Get applicants based on status and include HR name from the users table
    const [applicantsResult] = await db.query(
      `SELECT 
                hrinterview.applicant_uuid,
                hrinterview.hr_id,
             	hrinterview.updated_at,
                hrinterview.time_of_hrinterview,
                applicant_referrals.status AS applicant_status,
                applicant_referrals.name AS applicant_name,
                users.name AS hr_name  -- Fetch the HR name from the users table
            FROM 
                hrinterview
            JOIN 
                applicant_referrals ON hrinterview.applicant_uuid = applicant_referrals.applicant_uuid
            JOIN 
                users ON hrinterview.hr_id = users.id  -- Join with the users table to get HR name
            WHERE 
                applicant_referrals.status IN ('Spanish Evaluation', 'Store Evaluation', 'Applicant will think about It');`
    );

    res.status(200).json(applicantsResult);
    // console.log(applicantsResult);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};





module.exports = {
  getApplicationforinterviewr,
  getApplicationforhr,
  getAllApplicationsForHR,
  getApplicationforallhr,
  getApplicantsofScreening,
  getApplicationforTrainer,
  getAllTrainerFeedbackApplicants,
  getAllTrainerFeedbackApplicantDetails
  
};
