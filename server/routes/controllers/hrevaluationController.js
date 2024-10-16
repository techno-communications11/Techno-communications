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
        selectedEvalution,
        evaluationDate,
    } = req.body;

    try {
        // Convert acceptOffer and backOut to boolean-compatible integers
        const acceptOfferValue = (acceptOffer === 'Yes') ? 1 : 0;
        const backOutValue = (backOut === 'Yes') ? 1 : 0;

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
                reason_back_out,
                selectedEvalution,
                evaluationDate
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                applicantId,
                market,
                marketTraining,
                trainingLocation,
                compensationType,
                offeredSalary,
                payroll,
                acceptOfferValue,
                returnDate,
                joiningDate,
                notes,
                workHoursDays,
                backOutValue,
                reasonBackOut,
                selectedEvalution,
                evaluationDate,
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

        // Check if recommend_hiring is "selected at Hr" and update hrinterview table if true
        if (recommend_hiring === "selected at Hr") {
            const hrInterviewValues = [recommend_hiring, applicantId];
            const [hrUpdateResult] = await db.query(
                `UPDATE hrinterview
                 SET status = ?
                 WHERE applicant_uuid = ?`,
                hrInterviewValues
            );

            console.log("HR interview updated successfully. Update result:", hrUpdateResult);
        }

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
