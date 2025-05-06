const db = require("../testConnection");
const crypto = require("crypto");

// Function to generate a short unique ID based on the applicant's details
const generateShortID = (name, phoneNumber, currentYear) => {
  const rawString = `${name}-${phoneNumber}-${currentYear}`;
  const hash = crypto.createHash("md5").update(rawString).digest("hex");
  return hash.substring(0, 8).toUpperCase(); // Use the first 8 characters of the hash
};

// Controller to handle applicant referrals
const DirectReferal = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      referred_by,
      reference_id,
      sourcedBy,
      assign_to,
    } = req.body;
    const currentYear = new Date().getFullYear();
    const uuid = generateShortID(name, phone, currentYear);


    // Insert the applicant details into the applicant_referrals table
    const result = await db.query(
      "INSERT INTO applicant_referrals (applicant_uuid, name, email, phone, referred_by, sourced_by, reference_id, assigned_user_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())",
      [
        uuid,
        name,
        email,
        phone,
        referred_by,
        sourcedBy,
        reference_id,
        assign_to,
      ]
    );

    res
      .status(201)
      .json({
        message: "Applicant referral created successfully",
        referralId: result.insertId,
      });
  } catch (error) {
    console.error("Error creating applicant referral:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
};
const getApplicantsForDirect = async (req, res) => {
  const { userId } = req.params;

  try {
    // console.log("Fetching applicants for user:", userId);

    // Step 1: Fetch Applicants assigned to the user by assigned_user_id
    const [directApplicants] = await db.query(
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
                status = 'pending at screening';`,
      [userId]
    );

  

    const [locationsResult] = await db.query(
      `SELECT wl.id AS work_location_id
             FROM work_locations wl
             JOIN user_work_locations uwl ON wl.id = uwl.work_location_id
             WHERE uwl.user_id = ?`,
      [userId]
    );

    if (locationsResult.length === 0) {
      // If no work locations are found, return only the direct applicants
      return res.status(200).json(directApplicants);
    }

    const locationIds = locationsResult.map(
      (location) => location.work_location_id
    );

    // Step 3: Get Users for These Locations
    const [usersResult] = await db.query(
      `SELECT DISTINCT uwl.user_id
             FROM user_work_locations uwl
             WHERE uwl.work_location_id IN (?)`,
      [locationIds]
    );

    if (usersResult.length === 0) {
      // If no users are found for the locations, return only the direct applicants
      return res.status(200).json(directApplicants);
    }

    const userIds = [...new Set(usersResult.map((user) => user.user_id))];

    if (userIds.length === 0) {
      return res
        .status(404)
        .json({ message: "No user IDs available for assignment." });
    }

    // Step 4: Get Applicants for the User's Locations
    const [applicantsResult] = await db.query(
      `SELECT ar.id AS applicant_id, ar.applicant_uuid, ar.name AS applicant_name, ar.email AS applicant_email, 
                    ar.phone AS applicant_phone, ar.referred_by, ar.reference_id, ar.created_at
             FROM applicant_referrals ar
             WHERE ar.work_location IN (?)
             AND ar.status = 'pending at screening';`,
      [locationIds]
    );

    if (applicantsResult.length === 0) {
      // If no additional applicants are found for the locations, return only the direct applicants
      return res.status(200).json(directApplicants);
    }

    // Step 5: Distribute Applicants in Round-Robin Fashion
    let currentUserIndex = 0;
    const assignments = applicantsResult.map((applicant) => {
      const assignedUserId = userIds[currentUserIndex];
      currentUserIndex = (currentUserIndex + 1) % userIds.length;
      return [assignedUserId, applicant.applicant_uuid];
    });

    // Update applicant_referrals with assigned_user_id
    const updatePromises = assignments.map(([assignedUserId, applicantUuid]) =>
      db.query(
        `UPDATE applicant_referrals 
                 SET assigned_user_id = COALESCE(assigned_user_id, ?) 
                 WHERE applicant_uuid = ?`,
        [assignedUserId, applicantUuid]
      )
    );

    await Promise.all(updatePromises);

    // Step 6: Fetch the final list of applicants assigned to this user (after assignments)
    const [finalApplicants] = await db.query(
      `SELECT id AS applicant_id, applicant_uuid, name AS applicant_name, email AS applicant_email, 
                    phone AS applicant_phone, referred_by, reference_id, created_at, assigned_user_id
             FROM applicant_referrals 
             WHERE assigned_user_id = ?
             AND status = 'pending at screening';`,
      [userId]
    );

    // Combine directApplicants and finalApplicants if there are any new assignments
    const combinedApplicants = [...directApplicants, ...finalApplicants];

    // Return the final list of applicants (without duplicates)
    return res.status(200).json(combinedApplicants);
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch applicants. Please try again later." });
  }
};

const getWorkForLocDirect = async (req, res) => {
    try {
      const workLocation = 'Los Angeles'; // Directly assigning the work location value
      // console.log("Fetching applicants for work location:", workLocation);
  
      // Fetch Applicants assigned to the specified work location
      const [directApplicants] = await db.query(
        `SELECT 
                  id AS applicant_id, 
                  applicant_uuid, 
                  name AS applicant_name, 
                  email AS applicant_email, 
                  phone AS applicant_phone, 
                  referred_by, 
                  reference_id, 
                  created_at
               FROM 
                  applicant_referrals
               WHERE 
                  work_location= ?`,
        [workLocation] // Use workLocation variable directly here
      );
      // console.log("Database Query Result:", directApplicants);

      if (!directApplicants || directApplicants.length === 0) {
          // console.log('No applicants found for work location:', workLocation);
          return res.status(200).json([]); // Return empty array if no applicants found
      }


      return res.status(200).json(directApplicants);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      return res.status(500).json({ error: "Failed to fetch applicants. Please try again later." });
    }
  };
  
  const getAllusersOFDirectHiring = async (req, res) => {
    try {
      const { assigned_user_id } = req.body; // Retrieve assigned_user_id from the client
      // console.log(req.body, "data taken from client as id");
  
      if (!assigned_user_id) {
        console.error("assigned_user_id is required but not provided");
        return res.status(400).json({ error: "assigned_user_id is required" });
      }
  
      // console.log("Fetching applicants for assigned_user_id:", assigned_user_id);
  
      // Step 1: Query to get applicant_uuid from applicant_referrals using assigned_user_id
      const [applicantReferralsData] = await db.query(
        `SELECT 
            ar.applicant_uuid,ar.status
         FROM 
            applicant_referrals ar 
         WHERE 
            ar.assigned_user_id = ? 
            AND ar.applicant_uuid IS NOT NULL`, 
        [assigned_user_id]
      );
  
      // If no applicant data is found for this assigned_user_id
      if (!applicantReferralsData || applicantReferralsData.length === 0) {
        // console.log("No applicants found for assigned_user_id:", assigned_user_id);
        return res.status(200).json([]); // Return empty array if no applicants found
      }
  
      // Step 2: Extract applicant_uuid values
      const applicantUuids = applicantReferralsData.map(row => row.applicant_uuid);
  
      // Step 3: Query the hrevaluation table using the applicant_uuid values fetched
      const [hrevaluationData] = await db.query(
        `SELECT 
            id, applicant_id, market, market_training, training_location, 
            compensation_type, offered_salary, payroll, accept_offer, 
            return_date, joining_date, notes, work_hours_days, back_out, 
            Contract_disclosed, reason_back_out, selectedEvalution, evaluationDate, offDays
         FROM 
            hrevaluation
         WHERE 
            applicant_id IN (?)`, // Match applicant_id (likely linked to applicant_uuid)
        [applicantUuids]
      );
  
      // Combine both applicant and hrevaluation data if needed
      const combinedData = applicantReferralsData.map(applicant => {
        // Find related evaluation data for this applicant_uuid
        const relatedEvaluationData = hrevaluationData.filter(
          hre => hre.applicant_id === applicant.applicant_uuid
        );
        return { ...applicant, hrevaluationData: relatedEvaluationData };
      });
  
      // console.log("Fetched applicants and evaluations successfully:", combinedData);
      return res.status(200).json(combinedData);
  
    } catch (error) {
      console.error("Error fetching applicants:", error);
      return res.status(500).json({ error: "Failed to fetch applicants. Please try again later." });
    }
  };
  
  

  
  

module.exports = { DirectReferal, getApplicantsForDirect, getWorkForLocDirect,getAllusersOFDirectHiring };
