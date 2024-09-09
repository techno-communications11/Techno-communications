// controllers/hrevaluationController.js
const db = require('../config/db');

const addHREvaluation = async (req, res) => {
    console.log("trying to add hr evalution response ")
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

    console.log("recommend_hiring applicantId ->>>", applicantId)
    try {

        console.log([ applicantId,

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
    
            recommend_hiring,])
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
       
    }
};

module.exports = {
    addHREvaluation
}