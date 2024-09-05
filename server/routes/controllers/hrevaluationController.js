// controllers/hrevaluationController.js
const db = require('../config/db');

const addHREvaluation = async (req, res) => {
    console.log("trying to add hr evalution response ")
    const {
        applicantId,
        candidateEmail,
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
        proceedCandidate,
        phoneNumber,
        recommend_hiring,
        backOut,
        reasonBackOut,
        verificationJoining
    } = req.body;
    console.log("recommend_hiring", recommend_hiring, applicantId)
    try {
        const [result] = await db.query(
            `INSERT INTO hrevaluation (
                applicant_id,
                candidate_email,
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
                proceed_candidate,
                phone_number,
                back_out,
                reason_back_out,
                verification_joining
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
            [
                applicantId,
                candidateEmail,
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
                proceedCandidate,
                phoneNumber,
                backOut,
                reasonBackOut,
                verificationJoining
            ]
        );
        // Define the values for the update query
        console.log("recommend_hiring22222222", recommend_hiring)
        const valuesForUpdate = [recommend_hiring, applicantId];

        // Execute the update query
        const [updateResult] = await db.query(`
   UPDATE applicant_referrals
   SET status = ?
   WHERE applicant_uuid = ?
 `, valuesForUpdate);

        console.log("Database update successful");

        // Send a success response
        res.status(200).json({ message: 'Evaluation added successfully', result, updateResult });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("eeeeeeeeeeeeeeeee")
    }
};

module.exports = {
    addHREvaluation
}