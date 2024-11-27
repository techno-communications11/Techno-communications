const db = require('../config/db'); // Ensure the path matches your setup

// Get applicant details by hr_id
const formdetails = async (req, res) => {
    try {
        const hr_id = req.params.hr_id;
        // console.log("Received hr_id:", hr_id); // Log the hr_id

        // Query to get the data based on hr_id from the hrinterview table and the corresponding data in hrevaluation
        const query = `SELECT 
                hrevaluation.*, 
                applicant_referrals.name, 
                applicant_referrals.phone 
            FROM hrevaluation
            JOIN hrinterview 
                ON hrevaluation.applicant_id = hrinterview.applicant_uuid
            JOIN applicant_referrals
                ON hrevaluation.applicant_id = applicant_referrals.applicant_uuid
            WHERE hrinterview.hr_id = ?`;

        // console.log('Executing query with hr_id:', hr_id);

        // Using async/await with the mysql2 promise API
        const [rows] = await db.query(query, [hr_id]);

        // Check if there are any results, if not return 404
        if (rows.length === 0) {
            // console.log("No rows found for hr_id:", hr_id); // Log if no results are found
            return res.status(404).json({ message: 'No details found for this hr_id' });
        }

        // Send the results (rows) in the response with 200 status
        res.status(200).json({ message: 'Form details fetched successfully', rows });
        // console.log("Response sent with results:", rows); // Log the response sent
    } catch (err) {
        console.log("Error occurred while fetching data:", err.message); // Log the error
        res.status(500).json({ error: 'Error fetching form details: ' + err.message });
    }
};

const formDetailsForAllHRs = async (req, res) => {
    try {
        // console.log("Fetching form details for all HRs");

        // Query to get the data for all HRs from the hrinterview table, hrevaluation, and applicant_referrals
        const query = ` SELECT 
                hrevaluation.*, 
                applicant_referrals.name AS applicant_name, 
                applicant_referrals.phone AS applicant_phone, 
                users.name AS hr_name
            FROM 
                hrevaluation
            JOIN 
                hrinterview 
                ON hrevaluation.applicant_id = hrinterview.applicant_uuid
            JOIN 
                applicant_referrals 
                ON hrevaluation.applicant_id = applicant_referrals.applicant_uuid
            JOIN 
                users 
                ON hrinterview.hr_id = users.id;`; // Adjust status as needed

        // console.log('Executing query for all HRs');

        // Using async/await with the mysql2 promise API
        const [rows] = await db.query(query);

        // Check if there are any results, if not return 404
        if (rows.length === 0) {
            // console.log("No rows found for all HRs"); // Log if no results are found
            return res.status(404).json({ message: 'No details found for any HR' });
        }

        // Send the results (rows) in the response with 200 status
        res.status(200).json({ message: 'Form details fetched successfully for all HRs', rows });
        // console.log("Response sent with results:", rows); // Log the response sent
    } catch (err) {
        console.log("Error occurred while fetching data for all HRs:", err.message); // Log the error
        res.status(500).json({ error: 'Error fetching form details for all HRs: ' + err.message });
    }
};


// Update hrevalution table
const updateform = async (req, res) => {
    try {
        const applicant_id = req.params.applicant_id;
        // console.log("Received applicant_id:", applicant_id); // Log the applicant_id

        const {
            market, marketTraining, trainingLocation, compensationType,
            offeredSalary, payroll, acceptOffer, returnDate, joiningDate,
            notes, workHoursDays, backOut, reasonBackOut
        } = req.body;

        // Ensure applicant_id exists in the request
        if (!applicant_id) {
            // console.log("Applicant ID missing.");
            return res.status(400).json({ error: 'Applicant ID is required' });
        }

        // Validate required fields
        if (!market || !compensationType || !offeredSalary) {
            // console.log("Missing required fields."); // Log missing fields
            return res.status(400).json({ error: 'Required fields are missing (market, compensationType, or offeredSalary)' });
        }

        const updateData = {
            market,
            market_training: marketTraining || null,
            training_location: trainingLocation || null,
            compensation_type: compensationType,
            offered_salary: offeredSalary,
            payroll: payroll || null,
            accept_offer: acceptOffer || null,
            return_date: returnDate || null,
            joining_date: joiningDate || null,
            notes: notes || null,
            work_hours_days: workHoursDays || null,
            back_out: backOut || null,
            reason_back_out: reasonBackOut || null
        };

        // console.log("Update data:", updateData); // Log the data to be updated

        const query = `UPDATE hrevaluation SET ? WHERE applicant_id = ?`;
        // Using async/await with the mysql2 promise API
        const [result] = await db.query(query, [updateData, applicant_id]);

        if (result.affectedRows === 0) {
            // console.log("No rows affected."); // Log if no rows are updated
            return res.status(404).json({ message: 'Applicant not found or no changes made' });
        }

        // Send a success response with 200 status and details about the update
        res.status(200).json({
            message: 'Data updated successfully',
            affectedRows: result.affectedRows,
            updatedData: updateData  // Optionally return the updated data
        });
        console.log("Update successful, response sent."); // Log success and response
    } catch (err) {
        console.log("Error updating the record:", err.message); // Log the error
        res.status(500).json({ error: 'Error updating the record: ' + err.message });
    }
};

module.exports = {
    formdetails,
    updateform,
    formDetailsForAllHRs
};
