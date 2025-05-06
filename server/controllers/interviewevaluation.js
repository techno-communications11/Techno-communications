const db = require('../testConnection');

// Add first-round evaluation and update applicant referral status
const addFirstRoundEvaluation = async (req, res) => {
    const {
      applicant_uuid, applicants_age, applicants_gender, email_on_file, country, city, interviewed_before,
      visa_category, education_level, major_in, currently_studying, university_name, course_type, semester,
      had_car, family_operate_ti, cellphone_carrier, worked_before, currently_employed, current_company,
      current_job_in_ti, hours_of_daily_work, daily_wage, compensation_type, reason_to_leave, cellular_experience,
      name_tele_company_name, experience_of_tele, type_of_work_doing, other_employment_exp, foreign_work_exp,
      mention_line_exp, appearance, personality, confidence, communication_skills, pitch, overcoming_objections,
      negotiations, applicant_strength, applicants_weakness, comments, contract_sign, evaluation, recommend_hiring,
       current_city, current_country
    } = req.body;
  
    // Check if applicant_uuid is present
    if (!applicant_uuid) {
      return res.status(400).json({ error: 'applicant_uuid is missing' });
    }
  
  
    // Log the incoming fields for debugging
    // console.log('Incoming fields:', req.body);
  
    // Log the number of values
    const values = [
        applicant_uuid, applicants_age, applicants_gender, email_on_file, country, city, interviewed_before,
        visa_category, education_level, major_in, currently_studying, university_name, course_type, semester,
        had_car, family_operate_ti, cellphone_carrier, worked_before, currently_employed, current_company,
        current_job_in_ti, hours_of_daily_work, daily_wage, compensation_type, reason_to_leave, cellular_experience,
        name_tele_company_name, experience_of_tele, type_of_work_doing, other_employment_exp, foreign_work_exp,
        mention_line_exp, appearance, personality, confidence, communication_skills, pitch, overcoming_objections,
        negotiations, applicant_strength, applicants_weakness, comments, contract_sign, evaluation, recommend_hiring,
        current_city, current_country
      ];
      
  
    // console.log('Values array:', values);
  
    // SQL query for insertion
    const query = `
      INSERT INTO first_round_evaluation (
        applicant_uuid, applicants_age, applicants_gender, email_on_file, country, city, interviewed_before,
        visa_category, education_level, major_in, currently_studying, university_name, course_type, semester,
        had_car, family_operate_ti, cellphone_carrier, worked_before, currently_employed, current_company,
        current_job_in_ti, hours_of_daily_work, daily_wage, compensation_type, reason_to_leave, cellular_experience,
        name_tele_company_name, experience_of_tele, type_of_work_doing, other_employment_exp, foreign_work_exp,
        mention_line_exp, appearance, personality, confidence, communication_skills, pitch, overcoming_objections,
        negotiations, applicant_strength, applicants_weakness, comments, contract_sign, evaluation, recommend_hiring,
         current_city, current_country
      ) 
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;
  
    const updateQuery = `
      UPDATE applicant_referrals 
      SET status = ? 
      WHERE applicant_uuid = ?
    `;
  
    const valuesForUpdate = [recommend_hiring, applicant_uuid];
  
    try {
      // Insert evaluation
      const result = await db.query(query, values);
  
      // Update recommendation status
      const updateResult = await db.query(updateQuery, valuesForUpdate);
  
      res.status(200).json({
        message: 'Evaluation added successfully',
        result,
        updateResult,
      });
    } catch (error) {
      console.error('SQL Error:', error.message);
      res.status(500).json({ error: error.message });
    }
  };
  

// Get first-round evaluation by applicant ID
const getHREvaluationById = async (req, res) => {
    const { applicantId } = req.params;
    try {
        const [rows] = await db.query(
            `SELECT * FROM first_round_evaluation WHERE applicant_uuid = ?`, [applicantId]
        );
        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ message: 'No evaluation found for this applicant ID' });
        }
    } catch (error) {
        console.error('SQL Error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Add new status by applicant name
const addnewstatus = async (req, res) => {
    const { name_applicant } = req.body;

    try {
        const [results] = await db.query(
            `SELECT user_id, work_location FROM work_locations WHERE column_id = ?`, [name_applicant]
        );
        res.status(200).json({ message: 'Retrieved successfully', results });
    } catch (err) {
        console.error('SQL Error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getHREvaluationById,
    addFirstRoundEvaluation,
    addnewstatus
};
