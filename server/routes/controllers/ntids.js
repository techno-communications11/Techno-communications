const db = require('../config/db');

// Controller to create a new NTID entry
const createNtid = async (req, res) => {
    // console.log("Trying to create a new NTID entry>>>>>>>");

    // Destructure the data from the request body
    const { ntidCreated, ntidCreatedDate, ntid, addedToSchedule, markAsAssigned, applicant_uuid } = req.body;

    // Validate the input
    if (!ntidCreated || !ntidCreatedDate || !ntid || !applicant_uuid) {
        return res.status(400).json({ error: "NTID Created, NTID Created Date, NTID, and applicant_uuid are required." });
    }

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // Insert the new NTID entry into the ntids table
        const [result] = await connection.query(
            `INSERT INTO ntids (applicant_uuid, ntid_created, ntid_created_date, ntid, added_to_schedule, mark_as_assigned) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [applicant_uuid, ntidCreated, ntidCreatedDate, ntid, addedToSchedule, markAsAssigned]
        );

        // Update the status in the hrinterview table for the provided applicant_uuid
        await connection.query(
            `UPDATE hrinterview 
             SET status = "mark_assigned" 
             WHERE applicant_uuid = ?`,
            [applicant_uuid]
        );

        // Update the status in the applicant_referrals table for the provided applicant_uuid
        await connection.query(
            `UPDATE applicant_referrals  
             SET status = "mark_assigned" 
             WHERE applicant_uuid = ?`,
            [applicant_uuid]
        );

        // Commit the transaction
        await connection.commit();

        // Send a success response
        res.status(201).json({ message: "NTID entry created and status updated successfully", id: result.insertId });
    } catch (error) {
        // Rollback the transaction in case of error
        await connection.rollback();
        console.error("Error creating NTID entry or updating status:", error);
        res.status(500).json({ error: error.message });
    } finally {
        // Release the connection
        connection.release();
    }
};




const getSelectedAtHr = async (req, res) => {
    // console.log("Trying to get all selected applicants at HR stage");

    try {
        // Query to select relevant data from hrevaluation, applicant_referrals, and ntids tables
        const [applicants] = await db.query(
            `SELECT 
    hrinterview.updated_at AS updatedDate,
    hrevaluation.market AS MarketHiringFor, 
    hrevaluation.training_location AS TrainingAt, 
    hrevaluation.joining_date AS DateOfJoining,
    hrevaluation.payroll AS payroll,
    hrevaluation.offered_salary AS payment,
    hrevaluation.work_hours_days AS noOFDays,
    hrevaluation.Contract_disclosed AS contractDisclosed,
    hrevaluation.compensation_type AS compensation_type,
    hrevaluation.offDays AS offDays,
    hrevaluation.contract_sined AS contract_sined,
    applicant_referrals.applicant_uuid AS applicant_uuid,
    applicant_referrals.reference_id AS reference_id,
    applicant_referrals.referred_by AS referred_by,
    applicant_referrals.phone AS phone,
    applicant_referrals.email AS email,
    applicant_referrals.name AS name,
    applicant_referrals.created_at AS created_at,
    applicant_referrals.status AS status,
    ntids.ntid_created AS ntidCreated,
    ntids.ntid_created_date AS ntidCreatedDate,
    ntids.ntid AS ntid,
    ntids.added_to_schedule AS addedToSchedule
FROM 
    hrevaluation
INNER JOIN 
    applicant_referrals 
    ON hrevaluation.applicant_id = applicant_referrals.applicant_uuid
LEFT JOIN 
    ntids 
    ON applicant_referrals.applicant_uuid = ntids.applicant_uuid
LEFT JOIN 
    hrinterview -- Adding hrinterview table join
    ON applicant_referrals.applicant_uuid = hrinterview.applicant_uuid 
WHERE 
    applicant_referrals.status COLLATE utf8mb4_unicode_ci IN ("selected at Hr", "mark_assigned", "backOut");
`
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





    const getNtidDashboardCounts = async (req, res) => {
    console.log("Trying to get all selected applicants at HR stage");

    try {
        // Query to select relevant data from hrevaluation, applicant_referrals, and hrinterview tables
        const [applicants] = await db.query(
            `SELECT 
    h.applicant_id,
    h.joining_date,
    h.market,
    h.contract_sined,
    ar.status,
    ar.name,
    COALESCE(nt.ntid, 'N/A') AS ntid
FROM 
    hrevaluation h
JOIN 
    applicant_referrals ar 
    ON h.applicant_id = ar.applicant_uuid
LEFT JOIN 
    ntids nt 
    ON h.applicant_id = nt.applicant_uuid
WHERE 
    ar.status IN ('mark_assigned', 'selected at hr')
GROUP BY 
    h.applicant_id, 
    ar.applicant_uuid, 
    nt.ntid
ORDER BY 
    h.applicant_id;
`
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
    getSelectedAtHr,getNtidDashboardCounts
};
