const db = require('../config/db');

exports.addFirstRoundEvaluation = async (req, res) => {
    const {
       applicant_uuid,
    applicants_age,
    applicants_gender,
    email_on_file,
    country,
    city,
    interviewed_before,
    visa_category,
    education_level,
    major_in,
    currently_studying,
    university_name,
    course_type,
    semester,
    had_car,
    family_operate_ti,
    cellphone_carrier,
    worked_before,
    currently_employed,
    current_company,
    current_job_in_ti,
    hours_of_daily_work,
    daily_wage,
    compensation_type,
    reason_to_leave,
    cellular_experience,
    name_tele_company_name,
    experience_of_tele,
    type_of_work_doing,
    other_employment_exp,
    foreign_work_exp,
    mention_line_exp,
    appearance,
    personality,
    confidence,
    communication_skills,
    pitch,
    overcoming_objections,
    negotiations,
    applicant_strength,
    applicants_weakness,
    comments,
    contract_sign,
    evaluation,
    recommend_hiring,
    course_type_selection,
    current_residence,
    current_city,
    current_country,
    } = req.body;
    // console.log("incoming valuessssssssssssssssss..")

    const query = `
        INSERT INTO first_round_evaluation (
            applicant_uuid,
            applicants_age,
            applicants_gender,
            email_on_file,
            country,
            city,
            interviewed_before,
            visa_category,
            education_level,
            major_in,
            currently_studying,
            university_name,
            course_type,
            semester,
            had_car,
            family_operate_ti,
            cellphone_carrier,
            worked_before,
            currently_employed,
            current_company,
            current_job_in_ti,
            hours_of_daily_work,
            daily_wage,
            compensation_type,
            reason_to_leave,
            cellular_experience,
            name_tele_company_name,
            experience_of_tele,
            type_of_work_doing,
            other_employment_exp,
            foreign_work_exp,
            mention_line_exp,
            appearance,
            personality,
            confidence,
            communication_skills,
            pitch,
            overcoming_objections,
            negotiations,
            applicant_strength,
            applicants_weakness,
            comments,
            contract_sign,
            evaluation,
            recommend_hiring,
            course_type_selection,
            current_residence,
            current_city,
            current_country
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
       applicant_uuid,
    applicants_age,
    applicants_gender,
    email_on_file,
    country,
    city,
    interviewed_before,
    visa_category,
    education_level,
    major_in,
    currently_studying,
    university_name,
    course_type,
    semester,
    had_car,
    family_operate_ti,
    cellphone_carrier,
    worked_before,
    currently_employed,
    current_company,
    current_job_in_ti,
    hours_of_daily_work,
    daily_wage,
    compensation_type,
    reason_to_leave,
    cellular_experience,
    name_tele_company_name,
    experience_of_tele,
    type_of_work_doing,
    other_employment_exp,
    foreign_work_exp,
    mention_line_exp,
    appearance,
    personality,
    confidence,
    communication_skills,
    pitch,
    overcoming_objections,
    negotiations,
    applicant_strength,
    applicants_weakness,
    comments,
    contract_sign,
    evaluation,
    recommend_hiring,
    course_type_selection,
    current_residence,
    current_city,
    current_country,
    ];

    try {
       
        console.log('Values:', values);

        const [result] = await db.query(query, values);

        res.status(200).json({ message: 'Evaluation added successfully', result });
    } catch (error) {
        console.error('SQL Error:', error.message);
        res.status(500).json({ error: error.message });
    }
};



exports.getHREvaluationById = async (req, res) => {
    const { applicantId } = req.params;

    try {
        const [rows] = await db.query(
            `SELECT * FROM  first_round_evaluation WHERE applicant_uuid = ?`,
            [applicantId]
        );

        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ message: 'No evaluation found for this applicant ID' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
