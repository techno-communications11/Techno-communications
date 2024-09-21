const db = require('../config/db');

// Controller to create a new NTID entry
const createNtid = async (req, res) => {
    console.log("Trying to create a new NTID entry>>>>>>>");

    // Destructure the data from the request body
    const { ntidCreated, ntidCreatedDate, ntid, addedToSchedule, markAsAssigned, applicant_uuid } = req.body;

    // Validate the input (you can add more validation as needed)
    if (!ntidCreated || !ntidCreatedDate || !ntid) {
        return res.status(400).json({ error: "NTID Created, NTID Created Date, and NTID are required." });
    }

    try {
        // Insert the new NTID entry into the ntids table
        const [result] = await db.query(
            `INSERT INTO ntids (applicant_uuid,ntid_created, ntid_created_date, ntid, added_to_schedule, mark_as_assigned) 
             VALUES (?, ?, ?, ?, ?,?)`,
            [applicant_uuid, ntidCreated, ntidCreatedDate, ntid, addedToSchedule, markAsAssigned]
        );

        // Update the status column in the applicant_referrals table for the provided applicant_uuid
        await db.query(
            `UPDATE applicant_referrals 
             SET status = "Mark As Assigned" 
             WHERE applicant_uuid = ?`,
            [applicant_uuid]
        );

        // Send a success response
        res.status(201).json({ message: "NTID entry created and status updated successfully", id: result.insertId });
    } catch (error) {
        // Handle any errors
        console.error("Error creating NTID entry or updating status:", error);
        res.status(500).json({ error: error.message });
    }
};



const getSelectedAtHr = async (req, res) => {
    console.log("Trying to get all selected applicants at HR stage");

    try {
        // Query to select relevant data from hrevaluation and applicant_referrals tables
        const [applicants] = await db.query(
            `SELECT 
                hrevaluation.market AS MarketHiringFor, 
                hrevaluation.training_location AS TrainingAt, 
                hrevaluation.joining_date AS DateOfJoining,
                applicant_referrals.applicant_uuid AS applicant_uuid,
                applicant_referrals.phone AS phone,
                applicant_referrals.email AS email,
                applicant_referrals.name AS name
            FROM 
                hrevaluation
            INNER JOIN 
                applicant_referrals 
            ON 
                hrevaluation.applicant_id = applicant_referrals.applicant_uuid
            WHERE 
                applicant_referrals.status = "selected at Hr";`
        );
        if (applicants.length === 0) {
            return res.status(404).json({ message: "No applicants found selected at HR stage." });
        }

        // Return the result
        return res.status(200).json({
            message: "Applicants retrieved successfully",
            data: applicants
        });
    } catch (error) {
        console.error("Error fetching applicants", error);
        return res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createNtid,
    getSelectedAtHr
};
