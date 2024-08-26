// controllers/hrevaluationController.js
const db = require('../config/db');

exports.addHREvaluation = async (req, res) => {
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
        backOut,
        reasonBackOut,
        verificationJoining
    } = req.body;

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
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

        res.status(200).json({ message: 'HR evaluation added successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
