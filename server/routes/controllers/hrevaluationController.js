// controllers/hrevaluationController.js
const db = require('../config/db');

const addHREvaluation = async (req, res) => {
    console.log("Starting to add HR evaluation...");
    const {
        applicantId,
        market,
        marketTraining,
        trainingLocation,
        compensationType,
        offeredSalary,
        payroll,
        acceptOffer,
        returnDate,
        joiningDate,
        notes,
        workHoursDays,
        backOut,
        reasonBackOut,
        recommend_hiring,
    } = req.body;

    try {
        console.log("Received applicant data:", {
            applicantId,
            market,
            marketTraining,
            trainingLocation,
            compensationType,
            offeredSalary,
            payroll,
            acceptOffer,
            returnDate,
            joiningDate,
            notes,
            workHoursDays,
            backOut,
            reasonBackOut,
            recommend_hiring
        });

        // Insert data into hrevaluation table
        const [result] = await db.query(
            `INSERT INTO hrevaluation (
                applicant_id,
                market,
                market_training,
                training_location,
                compensation_type,
                offered_salary,
                payroll,
                accept_offer,
                return_date,
                joining_date,
                notes,
                work_hours_days,
                back_out,
                reason_back_out
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                applicantId,
                market,
                marketTraining,
                trainingLocation,
                compensationType,
                offeredSalary,
                payroll,
                acceptOffer,
                returnDate,
                joiningDate,
                notes,
                workHoursDays,
                backOut,
                reasonBackOut,
            ]
        );

        console.log("HR evaluation inserted successfully. Result:", result);

        // Update applicant_referrals table with recommendation
        const updateQuery = `
            UPDATE applicant_referrals
            SET status = ?
            WHERE applicant_uuid = ?
        `;
        const valuesForUpdate = [recommend_hiring, applicantId];
        const [updateResult] = await db.query(updateQuery, valuesForUpdate);

        console.log("Applicant referral updated successfully. Update result:", updateResult);

        // Send a success response
        res.status(200).json({ message: 'Evaluation added and referral updated successfully', result, updateResult });
    } catch (error) {
        // Detailed error logging for debugging
        console.error("Error during HR evaluation insertion or referral update:", error);

        // Send error response with status code and message
        res.status(500).json({ error: 'Failed to add HR evaluation or update referral', details: error.message });
    }
};

module.exports = {
    addHREvaluation
};
