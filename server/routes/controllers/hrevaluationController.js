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
        acceptOffer, // This needs conversion
        returnDate,
        joiningDate,
        notes,
        workHoursDays,
        backOut,
        reasonBackOut,
        recommend_hiring,
    } = req.body;

    try {
        // Convert acceptOffer to a boolean-compatible integer
        const acceptOfferValue = (acceptOffer === 'Yes') ? 1 : 0;
        const backOutValue = (backOut === 'Yes') ? 1 : 0; // Similar conversion for backOut if necessary

        // Insert into hrevaluation
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
            ) VALUES (?, ?, ?,  ?, ?, ?,  ?, ?, ?,  ?, ?, ?,  ?,?)`,
            [
                applicantId,
                market,
                marketTraining,

                trainingLocation,
                compensationType,
                offeredSalary,

                payroll,
                acceptOfferValue, // Using converted value
                returnDate,

                joiningDate,
                notes,
                workHoursDays,

                backOutValue, // Using converted value
                reasonBackOut,
            ]
        );

        console.log("HR evaluation inserted successfully. Result:", result);

        // Update applicant_referrals table with recommendation
        const valuesForUpdate = [recommend_hiring, applicantId];
        const [updateResult] = await db.query(
            `UPDATE applicant_referrals
             SET status = ?
             WHERE applicant_uuid = ?`,
            valuesForUpdate
        );

        console.log("Applicant referral updated successfully. Update result:", updateResult);

        // Send a success response
        res.status(200).json({ message: 'Evaluation added and referral updated successfully', result, updateResult });
    } catch (error) {
        console.error("Error during HR evaluation insertion or referral update:", error);
        res.status(500).json({ error: 'Failed to add HR evaluation or update referral', details: error.message });
    }
};


module.exports = {
    addHREvaluation
};
